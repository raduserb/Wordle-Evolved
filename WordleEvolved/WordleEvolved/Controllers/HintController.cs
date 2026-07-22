using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace WordleEvolved.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HintController : ControllerBase
    {
        [HttpGet]
        public ActionResult<string> Get()
        {
            try
            {
                var scriptPath = Path.Combine("..", "Script", "script.py");

                var start = new ProcessStartInfo
                {
                    FileName = "python",
                    Arguments = scriptPath,
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true
                };

                using (var process = Process.Start(start))
                {
                    using (var reader = process.StandardOutput)
                    {
                        string result = reader.ReadToEnd();
                        string error = process.StandardError.ReadToEnd();

                        if (!string.IsNullOrEmpty(error))
                        {
                            return BadRequest(error);
                        }

                        return result.Trim();
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
