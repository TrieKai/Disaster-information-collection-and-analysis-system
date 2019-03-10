using System;
using System.IO;
using System.Net;
using System.Text;

namespace net_page_crawlerV2
{
    public static class request
    {
        public static string get(string url, string type)
        {
            string response = "";

            try
            {
                WebRequest wReq = WebRequest.Create(url);
                WebResponse wResp = wReq.GetResponse();
                Stream respStream = wResp.GetResponseStream();
                using (StreamReader reader = new StreamReader(respStream, Encoding.GetEncoding(type)))
                {
                    response = reader.ReadToEnd();
                    return response;
                }
            }
            catch (System.Exception ex)
            {
                return "error: " + ex.Message;
            }
        }
    }
}
