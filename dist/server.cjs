var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_genai = require("@google/genai");
var import_meta = {};
import_dotenv.default.config();
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var aiClient = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new import_genai.GoogleGenAI({ apiKey });
  }
  return aiClient;
}
var CLINIC_SYSTEM_PROMPT = `
You are "AcuBot", the intelligent, compassionate, and knowledgeable virtual clinic assistant and patient guide for AcuMeD Acupuncture & Herbs Clinic located in Watertown, MA.

Clinic Details:
- Name: AcuMeD Acupuncture & Herbs Clinic
- Lead Acupuncturist & Practitioner: Dr. Mostafa Medhati (MD, Ph.D. in Traditional Chinese Medicine, 20+ years of clinical integrative practice)
- Location: 124 Watertown St, Suite 2B, Watertown, MA 02472 (Free patient parking on-site, easily accessible from Cambridge, Belmont, Newton, Boston, and Waltham)
- Phone: (617) 926-2888
- Email: contact@acumedclinic.com
- Hours:
  * Monday - Friday: 9:00 AM \u2013 7:00 PM
  * Saturday: 9:00 AM \u2013 4:00 PM
  * Sunday: Closed (Emergency on-call by appointment)

Key Specializations & Services:
1. Moving Qi Acupuncture - Signature gentle needle technique to restore energetic balance, relieve pain, and stimulate self-healing.
2. Herbal Medicine Formulations - Custom botanical preparations tailored to each patient's pulse, tongue, and constitutional diagnosis.
3. Microsystem Acupuncture - Targeted ear (auricular), scalp, and hand microsystem points for rapid neurological, migraine, and musculoskeletal relief.
4. Combination Holistic Therapy - Integrated sessions combining acupuncture, cupping (dry & wet/Hijama), and moxibustion (herbal heat therapy).
5. Infertility & Women's Health - Natural hormone balancing, PMS/PMDD relief, PCOS support, prenatal care, and IVF/IUI cycle support.
6. Pain Management - Sciatica, chronic low back pain, rotator cuff/shoulder injuries, arthritis, neck stiffness, and neuropathy.
7. Stress, Anxiety & Insomnia - Calming the sympathetic nervous system, boosting serotonin/endorphin regulation, and restorative sleep protocols.

Guidelines for Answering Patients:
1. Tone: Warm, empathetic, professional, reassuring, and clear.
2. Structure: Keep answers concise and easy to read (use short paragraphs or bullet points). Always offer a supportive conclusion.
3. Medical Disclaimer: Provide holistic educational guidance and explain how acupuncture/herbs work. Always include a brief reminder that this is for informational guidance and not a replacement for formal diagnosis, and for acute medical emergencies patients should contact 911 or their primary physician.
4. Booking Guidance: Encourage patients to book an initial consultation online via the "Book Appointment" button or call (617) 926-2888.
5. First Visit Expectations: Explain that initial appointments last ~60-75 minutes, including comprehensive intake, pulse/tongue assessment, and a relaxing treatment in private treatment suites. Needles are hair-thin, sterile, single-use, and virtually painless.
`;
function generateSmartClinicFallback(userMessage) {
  const msg = userMessage.toLowerCase();
  if (msg.includes("pain") || msg.includes("back") || msg.includes("sciatica") || msg.includes("neck") || msg.includes("shoulder") || msg.includes("knee") || msg.includes("arthritis")) {
    return `At AcuMeD Clinic, Dr. Mostafa Medhati specializes in chronic and acute pain management using our signature **Moving Qi Acupuncture**, cupping therapy, and gentle moxibustion. 

Most patients with sciatica, back pain, or joint stiffness experience significant relief within 3 to 5 tailored sessions. Our sterile, ultra-fine needles stimulate natural endorphin release and improve localized microcirculation to reduce inflammation at the source.

Would you like help scheduling an initial consultation or learning more about what to expect on your first visit?`;
  }
  if (msg.includes("fertility") || msg.includes("pregnant") || msg.includes("ivf") || msg.includes("iui") || msg.includes("pcos") || msg.includes("pms") || msg.includes("period") || msg.includes("menopause")) {
    return `Dr. Medhati provides compassionate, evidence-based **Fertility & Women's Health Support**. 

We help patients with:
\u2022 Natural conception support & cycle regulation
\u2022 IVF/IUI preparation and transfer day acupuncture
\u2022 PCOS, endometriosis, and painful period (dysmenorrhea) relief
\u2022 Hormonal balance through custom herbal prescriptions

Acupuncture enhances uterine blood flow, regulates hormone levels, and reduces stress associated with fertility treatments. We welcome you to schedule a consultation to create a personalized plan!`;
  }
  if (msg.includes("hurt") || msg.includes("needle") || msg.includes("painful") || msg.includes("feel")) {
    return `Acupuncture at AcuMeD is remarkably gentle and virtually painless! 

Our needles are hair-thin, flexible, sterile, and single-use\u2014completely different from hypodermic injection needles. Most patients feel only a slight sensation (like a tiny mosquito tap or a warm tingle) followed by a deep sense of relaxation and calm. Many patients even fall asleep during their 30-minute rest period!`;
  }
  if (msg.includes("hour") || msg.includes("time") || msg.includes("open") || msg.includes("when")) {
    return `**AcuMeD Clinic Operating Hours:**
\u2022 **Monday \u2013 Friday:** 9:00 AM \u2013 7:00 PM
\u2022 **Saturday:** 9:00 AM \u2013 4:00 PM
\u2022 **Sunday:** Closed (Emergency on-call available)

We are located at **124 Watertown St, Suite 2B, Watertown, MA 02472** with convenient free on-site parking.`;
  }
  if (msg.includes("cost") || msg.includes("price") || msg.includes("insurance") || msg.includes("fee")) {
    return `**Pricing & Insurance Information:**
\u2022 **Initial Comprehensive Consultation & Treatment:** $120 (60\u201375 mins)
\u2022 **Follow-up Acupuncture Session:** $85 (45\u201360 mins)
\u2022 **Herbal Medicine Consultation:** $65 + custom formula cost
\u2022 **Combination Cupping & Acupuncture:** $110

*Insurance:* We provide itemized Superbills with diagnostic codes (ICD-10/CPT) that you can easily submit to your health insurer or HSA/FSA account for reimbursement. We also accept all major credit cards, debit, and cash.`;
  }
  if (msg.includes("book") || msg.includes("appointment") || msg.includes("schedule")) {
    return `You can easily book your appointment with Dr. Mostafa Medhati in two ways:
1. Click the **"Book Appointment"** button on our website to choose your preferred day, time, and service.
2. Call our front desk directly at **(617) 926-2888**.

We look forward to welcoming you to our clinic at 124 Watertown St in Watertown, MA!`;
  }
  if (msg.includes("stress") || msg.includes("anxiety") || msg.includes("sleep") || msg.includes("insomnia") || msg.includes("fatigue")) {
    return `Acupuncture is clinically proven to regulate the autonomic nervous system by downregulating cortisol (stress hormone) and stimulating parasympathetic "rest and digest" mode.

Dr. Medhati combines auricular (ear) acupuncture, scalp microsystem points, and calming botanical teas to help patients break the cycle of chronic anxiety and achieve 7+ hours of restorative sleep.`;
  }
  if (msg.includes("cupping") || msg.includes("hijama") || msg.includes("moxa") || msg.includes("herb")) {
    return `At AcuMeD Clinic, we provide full-spectrum integrative therapies:
\u2022 **Cupping Therapy (Dry & Hijama):** Relieves deep myofascial tension, clears metabolic stagnation, and improves lymphatic drainage.
\u2022 **Moxibustion (Moxa):** Gentle warming herbal therapy that expels cold, invigorates Qi, and alleviates deep joint pain.
\u2022 **Custom Herbal Medicine:** Pure, certified organic herbal granules and teas formulated specifically for your constitutional needs.`;
  }
  return `Welcome to AcuMeD Acupuncture & Herbs Clinic! I'm AcuBot, your clinic assistant. 

Dr. Mostafa Medhati (MD, Ph.D. in Traditional Chinese Medicine) has over 20 years of experience helping patients find natural, lasting relief from:
\u2022 Chronic Back, Neck & Sciatic Pain
\u2022 Fertility & Hormonal Challenges (IVF support, PMS, PCOS)
\u2022 Migraines & Tension Headaches
\u2022 Anxiety, Stress & Insomnia
\u2022 Digestive & Metabolic Wellness

How can I assist you today? Feel free to ask about our treatments, first-visit process, clinic hours, or click **"Book Appointment"** to reserve a time!`;
}
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "A valid message string is required." });
      return;
    }
    const ai = getGeminiClient();
    if (!ai) {
      const fallbackResponse = generateSmartClinicFallback(message);
      res.json({
        reply: fallbackResponse,
        source: "smart-assistant"
      });
      return;
    }
    const contents = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const item of history.slice(-6)) {
        if (item.sender === "user") {
          contents.push({ role: "user", parts: [{ text: item.text }] });
        } else if (item.sender === "bot") {
          contents.push({ role: "model", parts: [{ text: item.text }] });
        }
      }
    }
    contents.push({ role: "user", parts: [{ text: message }] });
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents,
      config: {
        systemInstruction: CLINIC_SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 800
      }
    });
    const reply = response.text || generateSmartClinicFallback(message);
    res.json({ reply, source: "gemini" });
  } catch (error) {
    console.error("Error handling Gemini chat:", error);
    const fallbackResponse = generateSmartClinicFallback(req.body.message || "");
    res.json({
      reply: fallbackResponse,
      source: "smart-assistant-fallback",
      warning: "Live AI network temporary fallback used."
    });
  }
});
var voiceAudioCache = {};
function pcmToWavBase64(rawBase64, sampleRate = 24e3) {
  const pcmBuffer = Buffer.from(rawBase64, "base64");
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);
  const wavBuffer = Buffer.concat([header, pcmBuffer]);
  return wavBuffer.toString("base64");
}
app.post("/api/tour-voice", async (req, res) => {
  try {
    const { sceneId, text, voiceName = "zephyr" } = req.body;
    if (!text || typeof text !== "string") {
      res.status(400).json({ error: "Text string is required." });
      return;
    }
    const normalizedVoice = String(voiceName).toLowerCase();
    const validVoices = {
      zephyr: "zephyr",
      charon: "charon",
      fenrir: "fenrir",
      puck: "puck",
      kore: "kore",
      aoede: "aoede"
    };
    const targetVoice = validVoices[normalizedVoice] || "zephyr";
    const cacheKey = `${sceneId || "custom"}_${targetVoice}`;
    if (voiceAudioCache[cacheKey]) {
      res.json({
        audioBase64: voiceAudioCache[cacheKey].audioBase64,
        mimeType: voiceAudioCache[cacheKey].mimeType,
        cached: true
      });
      return;
    }
    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({ error: "AI voice service unavailable" });
      return;
    }
    const interaction = await ai.interactions.create({
      model: "gemini-3.1-flash-tts-preview",
      input: `Read this in a calm, relaxed, warm, and natural conversational cadence as Dr. Mostafa Medhati welcoming a patient into his clinic with authentic human warmth: "${text}"`,
      response_modalities: ["AUDIO"],
      generation_config: {
        speech_config: {
          language: "en-US",
          voice: targetVoice
        }
      }
    });
    let foundAudio = false;
    const steps = interaction?.steps || [];
    for (const step of steps) {
      if (step.type === "model_output" && Array.isArray(step.content)) {
        const audioContent = step.content.find((c) => c.type === "audio");
        if (audioContent && audioContent.data) {
          const rawData = audioContent.data;
          const wavBase64 = pcmToWavBase64(rawData, 24e3);
          const audioData = {
            audioBase64: wavBase64,
            mimeType: "audio/wav"
          };
          voiceAudioCache[cacheKey] = audioData;
          foundAudio = true;
          res.json({
            audioBase64: audioData.audioBase64,
            mimeType: audioData.mimeType,
            voice: targetVoice,
            source: "gemini-human-voice"
          });
          return;
        }
      }
    }
    if (!foundAudio) {
      res.status(500).json({ error: "No audio generated by TTS model" });
    }
  } catch (error) {
    console.error("Error generating AI human voice:", error?.message || error);
    res.status(500).json({ error: error?.message || "Voice generation error" });
  }
});
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AcuMeD Clinic Server running on port ${PORT}`);
  });
}
start();
//# sourceMappingURL=server.cjs.map
