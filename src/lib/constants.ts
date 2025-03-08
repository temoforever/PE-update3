export interface ContentType {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  buttonColor: string;
}

export interface Subcategory {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  features?: string[];
  color: string;
  buttonColor: string;
  contentTypes: ContentType[];
}

export interface Category {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  features?: string[];
  color: string;
  buttonColor: string;
  subcategories: Subcategory[];
}

export interface Stage {
  id: string;
  name: string;
  title: string;
  description: string;
  icon?: "book" | "target" | "users";
  color?: string;
  buttonColor?: string;
  features?: string[];
  imageUrl?: string;
  categories: Category[];
}

export const STAGES: Record<string, Stage> = {
  primary: {
    id: "primary",
    name: "المرحلة الابتدائية",
    title: "المرحلة الابتدائية",
    description: "اكتشف محتوى التربية البدنية للمرحلة الابتدائية",
    icon: "book",
    color: "bg-white",
    buttonColor: "bg-[#206549]",
    imageUrl: "https://i.imgur.com/sJbg6xJ.png",
    features: [
      "المهارات الحركية الأساسية",
      "الألعاب التعليمية الممتعة",
      "التمارين البدنية البسيطة",
      "تنمية الثقة بالنفس",
      "التعاون والعمل الجماعي",
    ],
    categories: [
      {
        id: "early-childhood",
        title: "مرحلة الطفولة المبكرة",
        description: "محتوى تعليمي مخصص للصفوف الأولية من الأول إلى الثالث",
        imageUrl: "https://i.imgur.com/ddVwLrc.png",
        features: [
          "تطوير المهارات الحركية الأساسية",
          "الألعاب التعليمية التفاعلية",
          "أنشطة تنمية الثقة بالنفس",
        ],
        color: "bg-[#761cc3]/10",
        buttonColor: "bg-[#761cc3]",
        subcategories: [
          {
            id: "active-play",
            title: "اللعب النشط",
            description: "مجموعة متنوعة من الأنشطة الحركية والألعاب التفاعلية",
            imageUrl: "https://i.imgur.com/05hZgET.png",
            features: ["ألعاب حركية", "أنشطة تفاعلية", "تمارين نشطة"],
            color: "bg-[#27AE60]/10",
            buttonColor: "bg-[#27AE60]",
            contentTypes: [
              {
                id: "images",
                title: "الصور",
                description: "مكتبة صور تعليمية للحركات والمهارات الأساسية",
                icon: "image",
                color: "bg-green-100",
                buttonColor: "bg-green-500",
              },
              {
                id: "videos",
                title: "الفيديوهات",
                description: "مقاطع فيديو تعليمية وتدريبية للمهارات الحركية",
                icon: "video",
                color: "bg-blue-100",
                buttonColor: "bg-blue-500",
              },
              {
                id: "files",
                title: "الملفات",
                description: "خطط دراسية وأنشطة تعليمية قابلة للتحميل",
                icon: "file",
                color: "bg-purple-100",
                buttonColor: "bg-purple-500",
              },
              {
                id: "talented",
                title: "الموهوبين",
                description:
                  "برامج خاصة لاكتشاف ورعاية المواهب الرياضية المبكرة",
                icon: "star",
                color: "bg-yellow-100",
                buttonColor: "bg-yellow-500",
              },
            ],
          },
          {
            id: "body-management",
            title: "إدارة الجسم",
            description: "تمارين متنوعة لتحسين التحكم والتوازن والمرونة",
            imageUrl: "https://i.imgur.com/YA0lyvE.png",
            features: ["توازن", "مرونة", "تحكم"],
            color: "bg-[#BD93F9]/10",
            buttonColor: "bg-[#BD93F9]",
            contentTypes: [
              {
                id: "images",
                title: "الصور",
                description: "مكتبة صور تعليمية للحركات والمهارات الأساسية",
                icon: "image",
                color: "bg-green-100",
                buttonColor: "bg-green-500",
              },
              {
                id: "videos",
                title: "الفيديوهات",
                description: "مقاطع فيديو تعليمية وتدريبية للمهارات الحركية",
                icon: "video",
                color: "bg-blue-100",
                buttonColor: "bg-blue-500",
              },
              {
                id: "files",
                title: "الملفات",
                description: "خطط دراسية وأنشطة تعليمية قابلة للتحميل",
                icon: "file",
                color: "bg-purple-100",
                buttonColor: "bg-purple-500",
              },
              {
                id: "talented",
                title: "الموهوبين",
                description:
                  "برامج خاصة لاكتشاف ورعاية المواهب الرياضية المبكرة",
                icon: "star",
                color: "bg-yellow-100",
                buttonColor: "bg-yellow-500",
              },
            ],
          },
          {
            id: "expressive-movement",
            title: "الحركة التعبيرية",
            description: "أنشطة إبداعية لتطوير المهارات الحركية التعبيرية",
            imageUrl: "https://i.imgur.com/0576Wqf.png",
            features: ["تعبير حركي", "إبداع", "تناسق"],
            color: "bg-[#7403ee]/10",
            buttonColor: "bg-[#7403ee]",
            contentTypes: [
              {
                id: "images",
                title: "الصور",
                description: "مكتبة صور تعليمية للحركات والمهارات الأساسية",
                icon: "image",
                color: "bg-green-100",
                buttonColor: "bg-green-500",
              },
              {
                id: "videos",
                title: "الفيديوهات",
                description: "مقاطع فيديو تعليمية وتدريبية للمهارات الحركية",
                icon: "video",
                color: "bg-blue-100",
                buttonColor: "bg-blue-500",
              },
              {
                id: "files",
                title: "الملفات",
                description: "خطط دراسية وأنشطة تعليمية قابلة للتحميل",
                icon: "file",
                color: "bg-purple-100",
                buttonColor: "bg-purple-500",
              },
              {
                id: "talented",
                title: "الموهوبين",
                description:
                  "برامج خاصة لاكتشاف ورعاية المواهب الرياضية المبكرة",
                icon: "star",
                color: "bg-yellow-100",
                buttonColor: "bg-yellow-500",
              },
            ],
          },
        ],
      },
      {
        id: "upper-grades",
        title: "مرحلة الصفوف العليا",
        description: "محتوى تعليمي مخصص للصفوف العليا من الرابع إلى السادس",
        imageUrl: "https://i.imgur.com/yv5Ny0t.png",
        features: [
          "تطوير المهارات الرياضية المتقدمة",
          "المشاركة في المنافسات",
          "تعزيز روح الفريق",
        ],
        color: "bg-[#FF79C6]/10",
        buttonColor: "bg-[#FFD000]",
        subcategories: [
          {
            id: "team-sports",
            title: "الألعاب الجماعية",
            description: "تطوير مهارات العمل الجماعي والتنسيق",
            imageUrl: "https://i.imgur.com/acwSG5W.png",
            features: ["كرة القدم", "كرة السلة", "الكرة الطائرة"],
            color: "bg-[#27AE60]/10",
            buttonColor: "bg-[#27AE60]",
            contentTypes: [
              {
                id: "images",
                title: "الصور",
                description: "مكتبة صور تعليمية للحركات والمهارات الأساسية",
                icon: "image",
                color: "bg-green-100",
                buttonColor: "bg-green-500",
              },
              {
                id: "videos",
                title: "الفيديوهات",
                description: "مقاطع فيديو تعليمية وتدريبية للمهارات الحركية",
                icon: "video",
                color: "bg-blue-100",
                buttonColor: "bg-blue-500",
              },
              {
                id: "files",
                title: "الملفات",
                description: "خطط دراسية وأنشطة تعليمية قابلة للتحميل",
                icon: "file",
                color: "bg-purple-100",
                buttonColor: "bg-purple-500",
              },
              {
                id: "talented",
                title: "الموهوبين",
                description:
                  "برامج خاصة لاكتشاف ورعاية المواهب الرياضية المبكرة",
                icon: "star",
                color: "bg-yellow-100",
                buttonColor: "bg-yellow-500",
              },
            ],
          },
          {
            id: "individual-sports",
            title: "الألعاب الفردية",
            description: "تنمية المهارات الشخصية والثقة بالنفس",
            imageUrl: "https://i.imgur.com/acwSG5W.png",
            features: ["الجمباز", "ألعاب القوى", "السباحة"],
            color: "bg-[#BD93F9]/10",
            buttonColor: "bg-[#BD93F9]",
            contentTypes: [
              {
                id: "images",
                title: "الصور",
                description: "مكتبة صور تعليمية للحركات والمهارات الأساسية",
                icon: "image",
                color: "bg-green-100",
                buttonColor: "bg-green-500",
              },
              {
                id: "videos",
                title: "الفيديوهات",
                description: "مقاطع فيديو تعليمية وتدريبية للمهارات الحركية",
                icon: "video",
                color: "bg-blue-100",
                buttonColor: "bg-blue-500",
              },
              {
                id: "files",
                title: "الملفات",
                description: "خطط دراسية وأنشطة تعليمية قابلة للتحميل",
                icon: "file",
                color: "bg-purple-100",
                buttonColor: "bg-purple-500",
              },
              {
                id: "talented",
                title: "الموهوبين",
                description:
                  "برامج خاصة لاكتشاف ورعاية المواهب الرياضية المبكرة",
                icon: "star",
                color: "bg-yellow-100",
                buttonColor: "bg-yellow-500",
              },
            ],
          },
        ],
      },
    ],
  },
};
