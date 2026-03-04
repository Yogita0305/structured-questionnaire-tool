function extractQuestions(text) {
  return text
    .split("\n")
    .map(q => q.trim())
    .filter(q => q.length > 0 && q.includes("?"));
}

function retrieveRelevantContent(question, references) {
  const questionWords = question
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(" ")
    .filter(w => w.length > 3);

  let bestMatch = null;
  let bestScore = 0;

  references.forEach(ref => {
    const content = ref.content.toLowerCase();
    let score = 0;

    questionWords.forEach(word => {
      if (content.includes(word)) score++;
    });

    if (score > bestScore) {
      bestScore = score;
      bestMatch = ref;
    }
  });

  return bestScore > 0 ? { ref: bestMatch, score: bestScore } : null;
}

async function generateAnswer(question, references) {
  const match = retrieveRelevantContent(question, references);

  if (!match) {
    return {
      answer: "Not found in references.",
      citation: "None",
      confidence: "Low"
    };
  }

  const contentLines = match.ref.content.split("\n");
  const questionWords = question.toLowerCase().split(" ");

  let bestLine = "";
  let bestScore = 0;

  contentLines.forEach(line => {
    let score = 0;
    questionWords.forEach(word => {
      if (line.toLowerCase().includes(word) && word.length > 3) {
        score++;
      }
    });

    if (score > bestScore) {
      bestScore = score;
      bestLine = line;
    }
  });

  if (!bestLine) {
    return {
      answer: "Not found in references.",
      citation: "None",
      confidence: "Low"
    };
  }

  return {
    answer: bestLine.trim(),
    citation: match.ref.file_name,
    confidence: bestScore > 2 ? "High" : "Medium"
  };
}
module.exports = { extractQuestions, generateAnswer };