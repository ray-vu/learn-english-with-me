export type Direction = "vi-en" | "en-vi";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface WritingExercise {
  id: number;
  direction: Direction;
  difficulty: Difficulty;
  title: string;
  sourceText: string;
  suggestedTranslation: string;
  tips: string[];
}

export const exercises: WritingExercise[] = [
  {
    id: 1,
    direction: "vi-en",
    difficulty: "beginner",
    title: "Buổi sáng yên bình",
    sourceText:
      "Buổi sáng hôm nay thật yên bình. Mặt trời mọc sớm, chiếu những tia nắng vàng qua ô cửa sổ. Tôi pha một tách cà phê nóng và ngồi đọc sách trên ban công. Tiếng chim hót líu lo khắp nơi, khiến không khí trở nên trong lành và dễ chịu.",
    suggestedTranslation:
      "This morning is so peaceful. The sun rises early, shining golden rays through the window. I make a cup of hot coffee and sit reading on the balcony. Birds chirp everywhere, making the air feel fresh and pleasant.",
    tips: [
      "Use simple past tense for completed actions",
      "'Líu lo' can be translated as 'chirp' or 'sing'",
      "'Trong lành' means fresh/clean (air)",
    ],
  },
  {
    id: 2,
    direction: "vi-en",
    difficulty: "intermediate",
    title: "Thành phố về đêm",
    sourceText:
      "Khi màn đêm buông xuống, thành phố khoác lên mình một vẻ đẹp hoàn toàn khác. Những ánh đèn lung linh phản chiếu trên mặt hồ yên tĩnh, tạo nên một bức tranh thơ mộng khó quên. Người người hối hả trên đường về nhà sau một ngày dài làm việc, mang theo bao nỗi mệt mỏi nhưng cũng không kém phần hi vọng về ngày mai.",
    suggestedTranslation:
      "As night falls, the city takes on a completely different beauty. The shimmering lights reflecting on the still lake create an unforgettable, poetic scene. People hurry home after a long day of work, carrying fatigue but also no small amount of hope for tomorrow.",
    tips: [
      "'Khoác lên mình' → 'takes on / dons'",
      "'Lung linh' → 'shimmering / twinkling'",
      "Use 'As' to introduce the time clause",
    ],
  },
  {
    id: 3,
    direction: "vi-en",
    difficulty: "advanced",
    title: "Biến đổi khí hậu",
    sourceText:
      "Biến đổi khí hậu đang là một trong những thách thức cấp bách nhất mà nhân loại phải đối mặt trong thế kỷ 21. Sự gia tăng nhiệt độ toàn cầu không chỉ gây ra hiện tượng băng tan, nước biển dâng mà còn làm trầm trọng thêm các hiện tượng thời tiết cực đoan. Để giải quyết vấn đề này, cần có sự hợp tác chặt chẽ giữa các quốc gia, doanh nghiệp và cá nhân trong việc giảm phát thải khí nhà kính và chuyển đổi sang năng lượng tái tạo.",
    suggestedTranslation:
      "Climate change is one of the most pressing challenges humanity faces in the 21st century. The rise in global temperatures not only causes glaciers to melt and sea levels to rise but also exacerbates extreme weather events. Addressing this issue requires close cooperation between nations, businesses, and individuals in reducing greenhouse gas emissions and transitioning to renewable energy.",
    tips: [
      "'Cấp bách' → 'pressing / urgent'",
      "Use 'not only...but also' structure",
      "'Khí nhà kính' → 'greenhouse gases'",
      "'Năng lượng tái tạo' → 'renewable energy'",
    ],
  },
  {
    id: 4,
    direction: "en-vi",
    difficulty: "beginner",
    title: "A Day at the Market",
    sourceText:
      "Every Sunday morning, my grandmother takes me to the local market. The market is full of colorful vegetables, fresh fruits, and the smell of freshly baked bread. She always stops to chat with the vendors, who have been her friends for many years. I love these moments because they remind me of the simple joys in life.",
    suggestedTranslation:
      "Mỗi sáng Chủ nhật, bà tôi dẫn tôi ra chợ địa phương. Khu chợ tràn ngập rau củ đủ màu sắc, trái cây tươi và mùi thơm của bánh mì mới nướng. Bà luôn dừng lại để trò chuyện với những người bán hàng, những người đã là bạn của bà nhiều năm qua. Tôi yêu những khoảnh khắc này vì chúng nhắc nhở tôi về những niềm vui giản dị trong cuộc sống.",
    tips: [
      "'Full of' → 'tràn ngập / đầy ắp'",
      "'Chat with' → 'trò chuyện với'",
      "'Remind me of' → 'nhắc nhở tôi về'",
    ],
  },
  {
    id: 5,
    direction: "en-vi",
    difficulty: "intermediate",
    title: "The Power of Habits",
    sourceText:
      "Research shows that nearly 40 percent of our daily actions are habits rather than conscious decisions. Habits form when the brain looks for ways to save effort. Once a habit is established, the brain stops fully participating in decision making and the behavior becomes automatic. Understanding this neurological process is the key to building good habits and breaking bad ones.",
    suggestedTranslation:
      "Nghiên cứu cho thấy gần 40 phần trăm hành động hàng ngày của chúng ta là thói quen chứ không phải quyết định có ý thức. Thói quen hình thành khi não bộ tìm cách tiết kiệm nỗ lực. Một khi thói quen được thiết lập, não bộ ngừng tham gia đầy đủ vào quá trình ra quyết định và hành vi trở nên tự động. Hiểu được quá trình thần kinh học này là chìa khóa để xây dựng thói quen tốt và từ bỏ thói quen xấu.",
    tips: [
      "'Conscious decisions' → 'quyết định có ý thức'",
      "'Neurological process' → 'quá trình thần kinh học'",
      "'Automatic' → 'tự động'",
    ],
  },
  {
    id: 6,
    direction: "en-vi",
    difficulty: "advanced",
    title: "Artificial Intelligence Ethics",
    sourceText:
      "As artificial intelligence systems become increasingly integrated into critical societal functions — from healthcare diagnostics to judicial sentencing — the ethical implications of algorithmic decision-making demand urgent scrutiny. Questions of transparency, accountability, and bias are no longer purely academic concerns; they have tangible consequences for individuals whose lives are shaped by opaque computational systems. A robust ethical framework must be developed collaboratively, drawing on diverse perspectives to ensure that AI serves humanity equitably.",
    suggestedTranslation:
      "Khi các hệ thống trí tuệ nhân tạo ngày càng được tích hợp sâu vào các chức năng quan trọng của xã hội — từ chẩn đoán y tế đến tuyên án tư pháp — những hàm ý đạo đức của việc ra quyết định theo thuật toán đòi hỏi sự xem xét khẩn cấp. Các câu hỏi về minh bạch, trách nhiệm và định kiến không còn là mối lo ngại thuần túy học thuật; chúng có hậu quả hữu hình đối với những cá nhân mà cuộc sống bị định hình bởi các hệ thống tính toán không minh bạch. Một khung đạo đức vững chắc phải được phát triển một cách hợp tác, dựa trên các quan điểm đa dạng để đảm bảo rằng AI phục vụ nhân loại một cách công bằng.",
    tips: [
      "'Algorithmic decision-making' → 'ra quyết định theo thuật toán'",
      "'Opaque' → 'không minh bạch / mờ đục'",
      "'Equitably' → 'một cách công bằng'",
      "Maintain formal register throughout",
    ],
  },
];

export const difficultyConfig = {
  beginner: { label: "Beginner", labelVi: "Cơ bản", color: "text-emerald-600", bg: "bg-emerald-100" },
  intermediate: { label: "Intermediate", labelVi: "Trung cấp", color: "text-amber-600", bg: "bg-amber-100" },
  advanced: { label: "Advanced", labelVi: "Nâng cao", color: "text-rose-600", bg: "bg-rose-100" },
};
