const Twit = require("twit");
const express = require("express");
const config = require("../utils/config.utils");
const PORT = 5000;
const app = express();

var T = new Twit(config);

app.post("/searchUser", (req, res) => {
  console.log("body", req.headers.name);
  let query = req.headers.name;
  T.get("users/search", { q: query, count: 10 }, (err, data, response) => {
    console.log(data);
    res.send(
      data.map((user) => ({
        name: user.name,
        id: user.id,
        screen_name: user.screen_name,
      }))
    );
  });
});

app.post("/getUserTweets", (req, res) => {
  console.log("body", req.headers);

  let {screen_name, user_id} = req.headers;
  console.log(screen_name, user_id);
  T.get(
    "statuses/user_timeline",
    { screen_name: screen_name, user_id: parseInt(user_id), count: 30 },
    (err, data, response) => {
      res.send(
        data.map((tweet) => ({
          created_at: tweet.created_at,
          text: tweet.text,
          screen_name: tweet.user.screen_name,
          name: tweet.user.name,
          profile_image: tweet.user.profile_image_url,
          retweet_count: tweet.retweet_count,
          favorite_count: tweet.favorite_count,
        }))
      );
    }
  );
});

app.get("/", (req, res) => res.send("Hi from server"));

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
