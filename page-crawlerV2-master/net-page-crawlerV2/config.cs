using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace net_page_crawlerV2
{
    class config
    {
        private string dbHost = "";//資料庫位址
        private string dbUser = "root";//資料庫使用者帳號
        private string dbPass = "";//資料庫使用者密碼
        private string dbName = "sick-detection";//資料庫名稱
        private MySqlConnection conn = null;
        private MySqlCommand command = null;
        private void login(string host, string user, string pass, string db)
        {
            this.dbHost = host;
            this.dbUser = user;
            this.dbPass = pass;
            this.dbName = db;
        }

        private void connect()
        {
            string connStr= "server=" + this.dbHost + ";uid=" + this.dbUser + ";pwd=" + this.dbPass + ";database=" + this.dbName + ";charset=utf8;";
            try
            {
                conn = new MySqlConnection(connStr);
                command = conn.CreateCommand();
                conn.Open();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        public void dbConn(string host, string user, string pass, string db)
        {
            this.login(host, user, pass, db);
            this.connect();
        }

        public MySqlCommand getCmd()
        {
            return this.command;
        }
    }
}
