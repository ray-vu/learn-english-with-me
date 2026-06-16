import type { Direction, PassageLengthUnit, WritingTopicGroup } from "./types";

export const DIRECTION_TABS: {
  value: Direction;
  label: string;
  hint: string;
  flag: string;
}[] = [
  {
    value: "en_to_vi",
    label: "Anh → Việt",
    hint: "Đọc tiếng Anh, dịch sang tiếng Việt",
    flag: "🇬🇧→🇻🇳",
  },
  {
    value: "vi_to_en",
    label: "Việt → Anh",
    hint: "Đọc tiếng Việt, dịch sang tiếng Anh",
    flag: "🇻🇳→🇬🇧",
  },
];

export const LENGTH_LIMITS: Record<
  PassageLengthUnit,
  { min: number; max: number; step: number }
> = {
  chars: { min: 180, max: 1200, step: 20 },
  lines: { min: 2, max: 8, step: 1 },
};

function createTopic(categoryId: string, label: string, vietnamese: string) {
  return {
    id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    label,
    categoryId,
    vietnamese,
  };
}

export const WRITING_TOPIC_GROUPS: WritingTopicGroup[] = [
  {
    id: "personal-life",
    label: "Personal Life",
    topics: [
      createTopic("personal-life", "My daily routine", "thói quen hằng ngày của tôi"),
      createTopic("personal-life", "My family", "gia đình của tôi"),
      createTopic("personal-life", "My hometown", "quê hương của tôi"),
      createTopic("personal-life", "My favorite food", "món ăn yêu thích của tôi"),
      createTopic("personal-life", "My weekend", "cuối tuần của tôi"),
      createTopic("personal-life", "My best friend", "người bạn thân nhất của tôi"),
      createTopic("personal-life", "My room", "căn phòng của tôi"),
      createTopic("personal-life", "My hobby", "sở thích của tôi"),
    ],
  },
  {
    id: "work-study",
    label: "Work & Study",
    topics: [
      createTopic("work-study", "My job", "công việc của tôi"),
      createTopic("work-study", "My working day", "ngày làm việc của tôi"),
      createTopic("work-study", "Learning English", "việc học tiếng Anh"),
      createTopic("work-study", "My favorite subject", "môn học yêu thích của tôi"),
      createTopic("work-study", "Working from home", "làm việc tại nhà"),
      createTopic("work-study", "My future career", "nghề nghiệp tương lai của tôi"),
      createTopic("work-study", "A difficult task at work", "một nhiệm vụ khó ở nơi làm việc"),
      createTopic("work-study", "My dream job", "công việc mơ ước của tôi"),
    ],
  },
  {
    id: "real-life-situations",
    label: "Real-life Situations",
    topics: [
      createTopic("real-life-situations", "Buying something", "mua một món đồ"),
      createTopic("real-life-situations", "Ordering food", "gọi món ăn"),
      createTopic("real-life-situations", "Asking for directions", "hỏi đường"),
      createTopic("real-life-situations", "Going to the doctor", "đi khám bác sĩ"),
      createTopic("real-life-situations", "Booking a hotel", "đặt phòng khách sạn"),
      createTopic("real-life-situations", "Making an appointment", "đặt lịch hẹn"),
      createTopic("real-life-situations", "Talking with a coworker", "nói chuyện với đồng nghiệp"),
      createTopic("real-life-situations", "Introducing myself", "giới thiệu bản thân"),
    ],
  },
  {
    id: "opinions",
    label: "Opinions",
    topics: [
      createTopic("opinions", "Why I like learning English", "vì sao tôi thích học tiếng Anh"),
      createTopic("opinions", "Should students use phones in class?", "học sinh có nên dùng điện thoại trong lớp không"),
      createTopic("opinions", "Is remote work better than office work?", "làm việc từ xa có tốt hơn làm việc ở văn phòng không"),
      createTopic("opinions", "Is online shopping convenient?", "mua sắm trực tuyến có tiện lợi không"),
      createTopic("opinions", "Why is exercise important?", "vì sao tập thể dục lại quan trọng"),
      createTopic("opinions", "Is technology good for children?", "công nghệ có tốt cho trẻ em không"),
    ],
  },
  {
    id: "developer-tech",
    label: "Developer / Tech Topics",
    topics: [
      createTopic("developer-tech", "My job as a frontend developer", "công việc frontend developer của tôi"),
      createTopic("developer-tech", "Why I like JavaScript", "vì sao tôi thích JavaScript"),
      createTopic("developer-tech", "Why I use ReactJS", "vì sao tôi dùng ReactJS"),
      createTopic("developer-tech", "My favorite website", "trang web yêu thích của tôi"),
      createTopic("developer-tech", "Working with a team", "làm việc cùng một đội nhóm"),
      createTopic("developer-tech", "Fixing a bug", "sửa một lỗi phần mềm"),
      createTopic("developer-tech", "Learning a new framework", "học một framework mới"),
      createTopic("developer-tech", "Building a small app", "xây dựng một ứng dụng nhỏ"),
      createTopic("developer-tech", "My dream SaaS product", "sản phẩm SaaS mơ ước của tôi"),
      createTopic("developer-tech", "Remote work for developers", "làm việc từ xa cho lập trình viên"),
    ],
  },
];

export const WRITING_TOPICS = WRITING_TOPIC_GROUPS.flatMap((group) => group.topics);
