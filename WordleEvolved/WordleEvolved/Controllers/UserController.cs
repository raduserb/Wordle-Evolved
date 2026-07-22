﻿using System.Collections.Generic;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WordleEvolved.Dto;
using WordleEvolved.Interfaces;
using WordleEvolved.Models;
using WordleEvolved.Repository;

namespace WordleEvolved.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserStatisticsRepository _userStatisticsRepository;
        private readonly IMapper _mapper;

        public UserController(IUserRepository userRepository, IUserStatisticsRepository userStatisticsRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _userStatisticsRepository = userStatisticsRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200,Type = typeof(IEnumerable<User>))]
        public IActionResult GetUsers() 
        {
            var users = _mapper.Map<List<UserDto>>(_userRepository.GetUsers());
            
            if(!ModelState.IsValid)
                return BadRequest(ModelState);
            
            return Ok(users);
        }

        [HttpGet("{userId}")]
        [ProducesResponseType(200, Type = typeof(User))]
        [ProducesResponseType(400)]
        public IActionResult GetUser(int userId)
        {
            if (!_userRepository.UserExists(userId))
                return NotFound();

            var user = _mapper.Map<UserDto>(_userRepository.GetUser(userId));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(user);
        }

        [HttpGet("username/{username}")]
        [ProducesResponseType(200, Type = typeof(User))]
        [ProducesResponseType(400)]
        public IActionResult GetUserByUsername(string username)
        {
            var user = _mapper.Map<UserDto>(_userRepository.GetUser(username));

            if (user == null)
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(user);
        }

        [HttpGet("{userId}/gamesessions")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<GameSession>))]
        [ProducesResponseType(400)]
        public IActionResult GetGameSessionsByUserId(int userId)
        {
            var gameSessions = _mapper.Map<List<GameSessionDto>>(_userRepository.GetGameSessionsByUserId(userId));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(gameSessions);
        }


        [HttpDelete("{userId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult DeleteUser(int userId)
        {
            if (!_userRepository.UserExists(userId))
                return NotFound();

            var userToDelete = _userRepository.GetUser(userId);
            if (userToDelete == null)
                return NotFound();

            //_userRepository.DeleteUserStatisticsByUserId(userId);

            _userRepository.DeleteGameSessionsByUserId(userId);

            if (!_userRepository.DeleteUser(userId))
            {
                ModelState.AddModelError("", $"Something went wrong deleting User with Id {userId}");
                return StatusCode(500, ModelState);
            }

            return NoContent();
        }

        [HttpPut("{userId}/makeadmin")]
        [ProducesResponseType(200, Type = typeof(User))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult MakeUserAdmin(int userId)
        {
            if (!_userRepository.UserExists(userId))
                return NotFound();

            var user = _userRepository.GetUser(userId);

            // Assuming you have an "IsAdmin" property in your User model
            if (user.Role != "owner")
            {
                user.Role = "admin";

                // Save the updated user
                _userRepository.UpdateUser(user);
            }
            else
            {
                // User is an owner; no need to update
                return Ok(user); // You can customize the response message here
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(user);
        }

        [HttpPut("{userId}/removeadmin")]
        [ProducesResponseType(200, Type = typeof(User))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult RemoveUserAdmin(int userId)
        {
            if (!_userRepository.UserExists(userId))
                return NotFound();

            var user = _userRepository.GetUser(userId);

            // Assuming you have an "IsAdmin" property in your User model
            if (user.Role == "admin")
            {
                user.Role = "user+"; // Set the new role after removing admin privileges

                // Save the updated user
                _userRepository.UpdateUser(user);
            }
            else
            {
                // User is not an admin; no need to update
                return Ok(user); // You can customize the response message here
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(user);
        }

        [HttpPut("{userId}/makeUserPlus")]
        [ProducesResponseType(200, Type = typeof(User))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult MakeUserPlus(int userId)
        {
            if (!_userRepository.UserExists(userId))
                return NotFound();

            var user = _userRepository.GetUser(userId);

            // Assuming you have an "IsAdmin" property in your User model
            if (user.Role != "owner" && user.Role != "admin")
            {
                user.Role = "user+";

                // Save the updated user
                _userRepository.UpdateUser(user);
            }
            else
            {
                // User is an owner; no need to update
                return Ok(user); // You can customize the response message here
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(user);
        }


    }
}