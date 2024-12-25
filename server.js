const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const path = require("path");
const server = http.createServer((req, res) => {
  let { method } = req;

  if (method == "GET") {
    if (req.url === "/") {
      fs.readFile("home.html", "utf8", (err, data) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end("Server Error");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        }
      });
    } else if (req.url.startsWith("/assets/")) {
      const filePath = path.join(__dirname, req.url);
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end("Not Found");
        } else {
          res.writeHead(200, { "Content-Type": "image/jpeg" });
          res.end(data);
        }
      });
    } else if (req.url == "/user-details") {
      fs.readFile("user.json", "utf8", (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end("Server Error");
        } else {
          res.end(data);
        }
      });
    } else if (req.url === "/register") {
      fs.readFile("./register.html", "utf8", (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end("Server Error");
        } else {
          res.end(data);
        }
      });
    } else if (req.url === "/show-details") {
      fs.readFile("user_details.html", "utf8", (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end("Server Error");
        } else {
          res.end(data);
        }
      });
    } else {
      console.log(req.url);
      res.writeHead(404);
      res.end("Not Found");
    }
  } else {
    if (req.url === "/register") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        let readdata = fs.readFileSync("User.json", "utf-8");
        console.log(readdata);

        if (!readdata) {
          fs.writeFileSync("User.json", JSON.stringify([]));
        } else {
          let jsonData = JSON.parse(readdata);
          let users = [...jsonData];
          console.log(users);

          let convertedbody = qs.decode(body);
          users.push(convertedbody);
          console.log(convertedbody);
          fs.writeFile("User.json", JSON.stringify(users), (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("userdata inserted succefuly");
            }
          });
        }
        fs.readFile("user_details.html", "utf8", (err, data) => {
          if (err) {
            res.writeHead(500);
            res.end("Server Error");
          } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
          }
        });
      });
    } else {
      res.writeHead(404);
      res.end("Not Found in post request");
    }
  }
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
