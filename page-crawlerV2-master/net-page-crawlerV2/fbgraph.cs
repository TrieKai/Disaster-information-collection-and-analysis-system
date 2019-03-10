using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace net_page_crawlerV2
{
    public static class fbgraph
    {
        private static string clientId = "296453647403892";
        private static string clientSecret = "27ba5397318455347054ae151e4cf622";

        public static string getPagePosts(string pageId)
        {
            return fbgraph.get("https://graph.facebook.com/v2.7/" + pageId + "/posts?access_token=" + clientId + "|" + clientSecret, "utf-8");
        }

        public static string getComments(string pageId)
        {
            return fbgraph.get("https://graph.facebook.com/v2.7/" + pageId + "/comments?access_token=" + clientId + "|" + clientSecret, "utf-8");
        }

        public static string getPagePosts(string pageId, string minDate, string maxDate)
        {
            return fbgraph.get("https://graph.facebook.com/v2.7/" + pageId + "/posts?since=" + minDate + "&until=" + maxDate + "&access_token=" + clientId + "|" + clientSecret, "utf-8");
        }

        private static string get(string url, string type)
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
