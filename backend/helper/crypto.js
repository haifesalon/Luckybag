// 匯入 crypto 套件
const crypto = require("crypto");

// 類別
exports.HashType = {
  MD5: "MD5",
  SHA1: "SHA1",
  SHA256: "SHA256",
  SHA512: "SHA512",
};

// 取得 Hash
exports.getHash = (hashType, text) => {
  let hashValue = new ArrayBuffer(32);
  try {
    const md = crypto.createHash(hashType);
    md.update(text);
    hashValue = md.digest("hex");
  } catch (e) {
    return;
  }
  return hashValue;
};

// 加密
exports.encrypt = (text, key) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(key, "utf8"),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

// 解密
exports.decrypt = (text, key) => {
  const parts = text.split(":");
  const iv = Buffer.from(parts.shift(), "hex");
  const encrypted = Buffer.from(parts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key, "utf8"),
    iv
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
