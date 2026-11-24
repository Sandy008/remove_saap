// Instagram "who doesn't follow me back" checker.
// HOW TO USE:
//   1. Open https://www.instagram.com in your browser (already logged in).
//   2. Press F12 (or Ctrl+Shift+I) -> Console tab.
//   3. Paste this whole file and press Enter.
//   4. Wait. Progress is logged; results print as a table and download as a .txt file.
//
// It pulls your Following and Followers lists in pages (instead of opening every
// profile), with pauses between requests to stay gentle on rate limits.

(async () => {
  const APP_ID = "936619743392459"; // Instagram web app id, required header
  const PAGE_SIZE = 50;
  const DELAY_MS = [1500, 3500];     // random pause between requests

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const jitter = () => DELAY_MS[0] + Math.random() * (DELAY_MS[1] - DELAY_MS[0]);

  const myId = document.cookie.match(/ds_user_id=(\d+)/)?.[1];
  if (!myId) {
    console.error("Not logged in (no ds_user_id cookie). Log in at instagram.com first.");
    return;
  }

  async function fetchAll(kind) {
    const users = new Map();
    let maxId = null;
    do {
      const url = new URL(`https://www.instagram.com/api/v1/friendships/${myId}/${kind}/`);
      url.searchParams.set("count", PAGE_SIZE);
      if (maxId) url.searchParams.set("max_id", maxId);

      const res = await fetch(url, {
        headers: { "X-IG-App-ID": APP_ID },
        credentials: "include",
      });
      if (res.status === 429) {
        console.warn("Rate limited. Waiting 60s...");
        await sleep(60000);
        continue;
      }
      if (!res.ok) throw new Error(`${kind}: HTTP ${res.status}`);

      const data = await res.json();
      for (const u of data.users || []) users.set(u.pk, u);
      maxId = data.next_max_id || null;
      console.log(`${kind}: ${users.size} loaded...`);
      if (maxId) await sleep(jitter());
    } while (maxId);
    return users;
  }

  console.log("Fetching who you follow...");
  const following = await fetchAll("following");
  console.log("Fetching your followers...");
  const followers = await fetchAll("followers");

  const notBack = [...following.values()].filter((u) => !followers.has(u.pk));

  console.log(`\nYou follow ${following.size}, ${followers.size} follow you.`);
  console.log(`${notBack.length} don't follow you back:`);
  console.table(notBack.map((u) => ({ username: u.username, name: u.full_name })));

  const text = notBack.map((u) => `https://www.instagram.com/${u.username}/`).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  a.download = "not_following_back.txt";
  a.click();
})();
