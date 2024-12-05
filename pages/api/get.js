export default async function handler(req, res) {
try {
const { url } = req.query;
const transUrl = url.replace("https://www.lazada.vn", "https://www-lazada-vn.translate.goog"); 
const enUrl = encodeURIComponent(transUrl);
const heroUrl = `https://jsonhero.io/actions/getPreview/${enUrl}?_data=routes%2Factions%2FgetPreview.%24url`;

// Gửi request tới URL được cung cấp
const response = await fetch(heroUrl, { redirect: 'manual' });

// Kiểm tra trạng thái của response
if (!response.ok) {
return res.status(response.status).json({ error: `Failed to fetch: ${response.statusText}` });
}

// Lấy dữ liệu từ response
const data = await response.json();

// Trả về dữ liệu
if (!data.error) {
    res.send(data.json);
} else {
const docJSON = await fetch("https://jsonhero.io/actions/createFromUrl?_data=routes%2Factions%2FcreateFromUrl", {
    "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9,vi;q=0.8,zh-CN;q=0.7,zh;q=0.6",
        "content-type": "application/x-www-form-urlencoded",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
      },
      "referrer": "https://jsonhero.io/actions/createFromUrl",
      "referrerPolicy": "strict-origin-when-cross-origin",
    "body": `jsonUrl=${encodeURIComponent(url)}`,
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
}).then(res => res.headers.get("x-remix-redirect"))
const response = await fetch(`https://jsonhero.io${docJSON}/editor?_data=routes%2Fj%2F%24id`)
const data = await response.json();
if (!data.message) {
res.send(data.json)
} else {
const transle = await fetch(transUrl, {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-US,en;q=0.9,vi;q=0.8,zh-CN;q=0.7,zh;q=0.6",
      "cache-control": "no-cache",
      "priority": "u=0, i",
      "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
      "sec-ch-ua-arch": "\"x86\"",
      "sec-ch-ua-bitness": "\"64\"",
      "sec-ch-ua-full-version-list": "\"Google Chrome\";v=\"131.0.6778.87\", \"Chromium\";v=\"131.0.6778.87\", \"Not_A Brand\";v=\"24.0.0.0\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-model": "\"\"",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-ch-ua-platform-version": "\"10.0.0\"",
      "sec-ch-ua-wow64": "?0",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1"
    },
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "omit"
  })
  const data = await transle.json();
  res.send(data)
}
}
} catch (error) {
res.status(500).json({ error: "Internal Server Error", details: error.message });
}
}

