using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;

namespace net_page_crawlerV2
{
    public partial class Form1 : Form
    {
        config sickConfig = null;

        public Form1()
        {
            InitializeComponent();
            sickConfig = new net_page_crawlerV2.config();
            sickConfig.dbConn("localhost", "root", "", "sick-detection");
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            backgroundWorker1.WorkerReportsProgress = true;
            backgroundWorker1.WorkerSupportsCancellation = true;
        }

        private void button1_Click(object sender, EventArgs e)
        {
            button1.Enabled = false;
            textBox1.Text = "";
            addText(textBox1, "Message: 開始抓取");

            BackgroundWorker worker = sender as BackgroundWorker;
            string allCategory = request.get("https://api.ser.ideas.iii.org.tw/api/fb_analysis/fb_category_keyword_search/categoryToPageId?category=%E5%A8%9B%E6%A8%82&token=api_doc_token", "utf-8");
            //dynamic categorys = Json.Decode(allCategory).result.page;
            dynamic categorys = JsonConvert.DeserializeObject(allCategory);
            dynamic pages = categorys.result.page;
            backgroundWorker1.RunWorkerAsync(pages);
        }

        private void backgroundWorker1_DoWork(object sender, DoWorkEventArgs e)
        {

            dynamic pages = (dynamic)e.Argument;
            for (int i = 0; i < pages.Count; i++)
            {
                try
                {
                    string pageId = pages[i].page_id;
                    string pagePosts = fbgraph.getPagePosts(pageId, dateTimePicker1.Value.ToString("yyyy/MM/dd"), dateTimePicker2.Value.ToString("yyyy/MM/dd"));
                    dynamic decode = JsonConvert.DeserializeObject(pagePosts);

                    for (int j = 0; j < decode.data.Count; j++)
                    {
                        try
                        {
                            var fbId = decode.data[j].id;
                            string message = decode.data[j].message.ToString().Replace("\n", "");
                            var createTime = decode.data[j].created_time;

                            sickConfig.getCmd().CommandText = "INSERT INTO raw(`fbId`, `message`, `create_time`) VALUES ('" + fbId + "', '" + message + "', '" + createTime + "')";
                            sickConfig.getCmd().ExecuteNonQuery();

                            string comments1 = fbgraph.getComments((string)fbId);
                            dynamic decode1 = JsonConvert.DeserializeObject(comments1);
                            for (int k1 = 0; k1 < decode1.data.Count; k1++)
                            {
                                try
                                {
                                    var fbId1 = decode1.data[k1].id;
                                    string message1 = decode1.data[k1].message.ToString().Replace("\n", "");
                                    var createTime1 = decode1.data[k1].created_time;

                                    sickConfig.getCmd().CommandText = "INSERT INTO raw(`fbId`, `message`, `create_time`) VALUES ('" + fbId1 + "', '" + message1 + "', '" + createTime1 + "')";
                                    sickConfig.getCmd().ExecuteNonQuery();

                                    string comments2 = fbgraph.getComments((string)fbId1);
                                    dynamic decode2 = JsonConvert.DeserializeObject(comments2);
                                    for (int k2 = 0; k2 < decode2.data.Count; k2++)
                                    {
                                        try
                                        {
                                            var fbId2 = decode2.data[k2].id;
                                            string message2 = decode2.data[k2].message.ToString().Replace("\n", "");
                                            var createTime2 = decode2.data[k2].created_time;

                                            sickConfig.getCmd().CommandText = "INSERT INTO raw(`fbId`, `message`, `create_time`) VALUES ('" + fbId2 + "', '" + message2 + "', '" + createTime2 + "')";
                                            sickConfig.getCmd().ExecuteNonQuery();
                                        }
                                        catch (Exception ex)
                                        {

                                        }

                                    }
                                }
                                catch (Exception ex)
                                {

                                }

                            }

                            recursiveCommentNext(comments1);

                            var progress = ((float)(i + 1) / (float)pages.Count) * 100;
                            backgroundWorker1.ReportProgress((int)progress, fbId);
                        }
                        catch (Exception ex)
                        {
                            var progress = ((float)(i + 1) / (float)pages.Count) * 100;
                            backgroundWorker1.ReportProgress((int)progress, "例外狀況: " + ex);
                        }



                        Thread.Sleep(500);
                    }

                    recursiveNext(pagePosts);
                }
                catch (Exception ex)
                {
                    var progress = ((float)(i + 1) / (float)pages.Count) * 100;
                    backgroundWorker1.ReportProgress((int)progress, "例外狀況: " + ex);
                }
            }
        }

        private void recursiveNext(string pagePosts)
        {
            try
            {
                string temp = pagePosts;
                while (true)
                {

                    dynamic decodeTemp = JsonConvert.DeserializeObject(temp);
                    string temp2 = request.get(decodeTemp.paging.next, "utf-8");
                    dynamic decode = JsonConvert.DeserializeObject(temp2);

                    for (int j = 0; j < decode.data.Count; j++)
                    {
                        try
                        {
                            var fbId = decode.data[j].id;
                            string message = decode.data[j].message.ToString().Replace("\n", "");
                            var createTime = decode.data[j].created_time;

                            sickConfig.getCmd().CommandText = "INSERT INTO raw(`fbId`, `message`, `create_time`) VALUES ('" + fbId + "', '" + message + "', '" + createTime + "')";
                            sickConfig.getCmd().ExecuteNonQuery();

                            string comments1 = fbgraph.getComments((string)fbId);
                            dynamic decode1 = JsonConvert.DeserializeObject(comments1);
                            for (int k1 = 0; k1 < decode1.data.Count; k1++)
                            {
                                try
                                {
                                    var fbId1 = decode1.data[k1].id;
                                    string message1 = decode1.data[k1].message.ToString().Replace("\n", "");
                                    var createTime1 = decode1.data[k1].created_time;

                                    sickConfig.getCmd().CommandText = "INSERT INTO raw(`fbId`, `message`, `create_time`) VALUES ('" + fbId1 + "', '" + message1 + "', '" + createTime1 + "')";
                                    sickConfig.getCmd().ExecuteNonQuery();

                                    string comments2 = fbgraph.getComments((string)fbId1);
                                    dynamic decode2 = JsonConvert.DeserializeObject(comments2);
                                    for (int k2 = 0; k2 < decode2.data.Count; k2++)
                                    {
                                        try
                                        {
                                            var fbId2 = decode2.data[k2].id;
                                            string message2 = decode2.data[k2].message.ToString().Replace("\n", "");
                                            var createTime2 = decode2.data[k2].created_time;

                                            sickConfig.getCmd().CommandText = "INSERT INTO raw(`fbId`, `message`, `create_time`) VALUES ('" + fbId2 + "', '" + message2 + "', '" + createTime2 + "')";
                                            sickConfig.getCmd().ExecuteNonQuery();
                                        }
                                        catch (Exception ex)
                                        {

                                        }

                                    }
                                }
                                catch (Exception ex)
                                {

                                }

                            }

                            recursiveCommentNext(comments1);
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine(ex);
                        }

                        Thread.Sleep(500);
                    }
                    temp = temp2;

                    //temp = temp2;
                }

            }
            catch (Exception ex)
            {

            }
        }

        private void recursiveCommentNext(string comments)
        {
            try
            {
                string temp = comments;
                while (true)
                {
                    dynamic decode = JsonConvert.DeserializeObject(temp);
                    string temp2 = request.get(decode.paging.next, "utf-8");
                    dynamic decode2 = JsonConvert.DeserializeObject(temp2);
                    for (int k2 = 0; k2 < decode2.data.Count; k2++)
                    {
                        var fbId2 = decode2.data[k2].id;
                        string message2 = decode2.data[k2].message.ToString().Replace("\n", "");
                        var createTime2 = decode2.data[k2].created_time;

                        sickConfig.getCmd().CommandText = "INSERT INTO raw(`fbId`, `message`, `create_time`) VALUES ('" + fbId2 + "', '" + message2 + "', '" + createTime2 + "')";
                        sickConfig.getCmd().ExecuteNonQuery();
                    }
                    temp = temp2;
                }

            }
            catch (Exception ex)
            {

            }
        }

        private void addText(TextBox component, string text)
        {
            component.Text = text + Environment.NewLine + component.Text;
        }

        private void backgroundWorker1_ProgressChanged(object sender, ProgressChangedEventArgs e)
        {
            addText(textBox1, e.ProgressPercentage + "%: 加入fb posts ID " + e.UserState as string);
        }

        private void backgroundWorker1_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            addText(textBox1, "Message: 抓取完成");
            button1.Enabled = true;
        }
    }
}
