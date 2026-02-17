#!/usr/bin/env node
/**
 * Fetch all 600 driving theory questions from taplai.com API
 * and convert to sample.json format for the app.
 *
 * Usage: node scripts/fetch_questions.js
 */

const fs = require("fs");
const path = require("path");

const API_URL = "https://taplai.com/jshuy/600cau2025/get_question.php";
const OUTPUT_PATH = path.join(__dirname, "..", "src", "data", "sample.json");

// Category mapping from API → app topic IDs
const CATEGORY_MAP = {
    "khai-niem": "t-khai-niem",
    "van-hoa": "t-van-hoa",
    "ky-thuat": "t-ky-thuat",
    "cau-tao": "t-cau-tao",
    "bien-bao": "t-bien-bao",
    "tinh-huong": "t-tinh-huong",
    "diem-liet": "t-diem-liet",
};

const TOPICS = [
    { id: "t-khai-niem", name: "Khái niệm và quy tắc", parentId: null },
    { id: "t-van-hoa", name: "Văn hóa giao thông", parentId: null },
    { id: "t-ky-thuat", name: "Kỹ thuật lái xe", parentId: null },
    { id: "t-cau-tao", name: "Cấu tạo sửa chữa", parentId: null },
    { id: "t-bien-bao", name: "Biển báo", parentId: null },
    { id: "t-tinh-huong", name: "Tình huống giao thông", parentId: null },
    { id: "t-diem-liet", name: "Câu điểm liệt", parentId: null },
];

function mapCategory(rawCategory) {
    if (!rawCategory) return "t-khai-niem";
    // Category can contain multiple values like "khai-niem diem-liet"
    const parts = rawCategory.trim().split(/\s+/);
    // Use the first non-diem-liet category as primary, unless it's only diem-liet
    const primary = parts.find((p) => p !== "diem-liet") || "diem-liet";
    return CATEGORY_MAP[primary] || "t-khai-niem";
}

function isCritical(rawCategory) {
    if (!rawCategory) return false;
    return rawCategory.includes("diem-liet");
}

function convertQuestion(q) {
    const qId = `q${q.number}`;
    const topicId = mapCategory(q.category);
    const critical = isCritical(q.category);

    // Build image URL
    let imageUrl = null;
    if (q.hinhanhq) {
        imageUrl = q.hinhanhq.startsWith("http")
            ? q.hinhanhq
            : `https://taplai.com${q.hinhanhq}`;
    }

    // Convert answers
    const answers = (q.answers || []).map((a, idx) => ({
        id: `${qId}a${idx + 1}`,
        content: a.text || "",
        isCorrect: !!a.correct,
    }));

    return {
        id: qId,
        content: q.question || "",
        explanation: q.explanation || "",
        imageUrl,
        topicId,
        isCritical: critical,
        answers,
    };
}

async function main() {
    console.log("Fetching 600 questions from taplai.com API...");

    const res = await fetch(API_URL);
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const rawQuestions = await res.json();
    console.log(`Received ${rawQuestions.length} questions.`);

    const questions = rawQuestions.map(convertQuestion);

    // Stats
    const topicCounts = {};
    let criticalCount = 0;
    let imageCount = 0;
    for (const q of questions) {
        topicCounts[q.topicId] = (topicCounts[q.topicId] || 0) + 1;
        if (q.isCritical) criticalCount++;
        if (q.imageUrl) imageCount++;
    }

    console.log("\nTopic distribution:");
    for (const [tid, count] of Object.entries(topicCounts)) {
        const topic = TOPICS.find((t) => t.id === tid);
        console.log(`  ${topic?.name || tid}: ${count}`);
    }
    console.log(`\nCritical questions (điểm liệt): ${criticalCount}`);
    console.log(`Questions with images: ${imageCount}`);

    const output = { topics: TOPICS, questions };
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf-8");
    console.log(`\nWritten ${questions.length} questions to ${OUTPUT_PATH}`);
}

main().catch((err) => {
    console.error("Error:", err);
    process.exit(1);
});
