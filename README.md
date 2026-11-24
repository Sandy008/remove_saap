# remove_saap 🐍

Find the saaps in your following list: the Instagram accounts you follow that don't follow you back.

It's a single script you paste into your browser console while you're logged in to Instagram. There's nothing to install, and you never hand your password to anyone.

## How to use

1. Open [instagram.com](https://www.instagram.com) and log in.
2. Press **F12** (or **Ctrl+Shift+I**, or **Cmd+Option+I** on a Mac) and open the **Console** tab.
3. Copy everything in [`instagram_unfollowers.js`](instagram_unfollowers.js), paste it into the console and press **Enter**.
   - If Chrome blocks the paste, type `allow pasting`, press Enter and paste again.
4. Wait while it loads your lists. You'll see the progress in the console.

## What you get

- A table in the console of everyone who doesn't follow you back
- A downloaded `not_following_back.txt` file with links to their profiles

## How it works

The script doesn't open every profile. It fetches your **Following** and **Followers** lists, a page at a time, through the same endpoints instagram.com itself uses, and compares the two. Your existing browser session handles the login, so the script never sees your password.

## ⚠️ Heads up

- Automated access goes against Instagram's Terms of Use. The script pauses between requests and backs off when it gets rate-limited, but **use it at your own risk** and don't run it over and over.
- It relies on Instagram's internal web API, which can change without notice. If you get HTTP 400 or 404 errors, the endpoints or the `X-IG-App-ID` value have probably changed.
- It doesn't unfollow anyone. It only shows you who to remove. That part is up to you 😄

## License

Use it, fork it, share it.
