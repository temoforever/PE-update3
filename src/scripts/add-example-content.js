import { supabase } from "../lib/supabase";

// Function to add example content to the database
async function addExampleContent() {
  try {
    // Get admin user
    const { data: adminData } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", "eng.mohamed87@live.com")
      .single();

    if (!adminData?.id) {
      console.error("Admin not found");
      return;
    }

    // Example content for different categories and types
    const exampleContent = [
      // اللعب النشط - الصور
      {
        title: "تمارين اللعب النشط للأطفال",
        description:
          "مجموعة من الصور التوضيحية لتمارين اللعب النشط المناسبة للأطفال في المرحلة الابتدائية",
        url: "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=800&q=80",
        type: "image",
        stage_id: "primary",
        category_id: "active-play",
        created_by: adminData.id,
      },
      // اللعب النشط - الفيديوهات
      {
        title: "فيديو تعليمي للألعاب الحركية",
        description:
          "فيديو يشرح مجموعة من الألعاب الحركية التي تساعد على تنمية المهارات الحركية للأطفال",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        type: "video",
        stage_id: "primary",
        category_id: "active-play",
        created_by: adminData.id,
      },
      // اللعب النشط - الملفات
      {
        title: "دليل المعلم للألعاب الحركية",
        description:
          "ملف PDF يحتوي على دليل شامل للمعلم لتنفيذ الألعاب الحركية في حصص التربية البدنية",
        url: "https://www.africau.edu/images/default/sample.pdf",
        type: "file",
        stage_id: "primary",
        category_id: "active-play",
        created_by: adminData.id,
      },
      // اللعب النشط - الموهوبين
      {
        title: "برنامج اكتشاف المواهب الرياضية",
        description:
          "برنامج متكامل لاكتشاف ورعاية المواهب الرياضية في مرحلة الطفولة المبكرة",
        url: "https://images.unsplash.com/photo-1577741314755-048d8525d31e?w=800&q=80",
        type: "talent",
        stage_id: "primary",
        category_id: "active-play",
        created_by: adminData.id,
      },

      // الحركة التعبيرية - الصور
      {
        title: "صور للحركات التعبيرية",
        description: "مجموعة من الصور التوضيحية للحركات التعبيرية المختلفة",
        url: "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&q=80",
        type: "image",
        stage_id: "primary",
        category_id: "expressive-movement",
        created_by: adminData.id,
      },
      // الحركة التعبيرية - الفيديوهات
      {
        title: "فيديو تعليمي للحركات التعبيرية",
        description: "فيديو يشرح كيفية أداء الحركات التعبيرية بطريقة صحيحة",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        type: "video",
        stage_id: "primary",
        category_id: "expressive-movement",
        created_by: adminData.id,
      },
      // الحركة التعبيرية - الملفات
      {
        title: "دليل الحركات التعبيرية",
        description:
          "ملف PDF يحتوي على شرح مفصل للحركات التعبيرية وكيفية تدريسها",
        url: "https://www.africau.edu/images/default/sample.pdf",
        type: "file",
        stage_id: "primary",
        category_id: "expressive-movement",
        created_by: adminData.id,
      },
      // الحركة التعبيرية - الموهوبين
      {
        title: "برنامج الموهوبين في الحركات التعبيرية",
        description:
          "برنامج خاص لاكتشاف ورعاية الموهوبين في مجال الحركات التعبيرية",
        url: "https://images.unsplash.com/photo-1577741314755-048d8525d31e?w=800&q=80",
        type: "talent",
        stage_id: "primary",
        category_id: "expressive-movement",
        created_by: adminData.id,
      },

      // الألعاب الجماعية - الصور
      {
        title: "صور للألعاب الجماعية",
        description: "مجموعة من الصور التوضيحية للألعاب الجماعية المختلفة",
        url: "https://images.unsplash.com/photo-1577741314755-048d8525d31e?w=800&q=80",
        type: "image",
        stage_id: "primary",
        category_id: "team-sports",
        created_by: adminData.id,
      },
      // الألعاب الجماعية - الفيديوهات
      {
        title: "فيديو تعليمي للألعاب الجماعية",
        description: "فيديو يشرح قواعد وأساسيات الألعاب الجماعية المختلفة",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        type: "video",
        stage_id: "primary",
        category_id: "team-sports",
        created_by: adminData.id,
      },
      // الألعاب الجماعية - الملفات
      {
        title: "دليل المعلم للألعاب الجماعية",
        description:
          "ملف PDF يحتوي على دليل شامل للمعلم لتدريس الألعاب الجماعية",
        url: "https://www.africau.edu/images/default/sample.pdf",
        type: "file",
        stage_id: "primary",
        category_id: "team-sports",
        created_by: adminData.id,
      },
      // الألعاب الجماعية - الموهوبين
      {
        title: "برنامج الموهوبين في الألعاب الجماعية",
        description:
          "برنامج خاص لاكتشاف ورعاية الموهوبين في مجال الألعاب الجماعية",
        url: "https://images.unsplash.com/photo-1577741314755-048d8525d31e?w=800&q=80",
        type: "talent",
        stage_id: "primary",
        category_id: "team-sports",
        created_by: adminData.id,
      },

      // الألعاب الفردية - الصور
      {
        title: "صور للألعاب الفردية",
        description: "مجموعة من الصور التوضيحية للألعاب الفردية المختلفة",
        url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
        type: "image",
        stage_id: "primary",
        category_id: "individual-sports",
        created_by: adminData.id,
      },
      // الألعاب الفردية - الفيديوهات
      {
        title: "فيديو تعليمي للألعاب الفردية",
        description: "فيديو يشرح قواعد وأساسيات الألعاب الفردية المختلفة",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        type: "video",
        stage_id: "primary",
        category_id: "individual-sports",
        created_by: adminData.id,
      },
      // الألعاب الفردية - الملفات
      {
        title: "دليل المعلم للألعاب الفردية",
        description:
          "ملف PDF يحتوي على دليل شامل للمعلم لتدريس الألعاب الفردية",
        url: "https://www.africau.edu/images/default/sample.pdf",
        type: "file",
        stage_id: "primary",
        category_id: "individual-sports",
        created_by: adminData.id,
      },
      // الألعاب الفردية - الموهوبين
      {
        title: "برنامج الموهوبين في الألعاب الفردية",
        description:
          "برنامج خاص لاكتشاف ورعاية الموهوبين في مجال الألعاب الفردية",
        url: "https://images.unsplash.com/photo-1577741314755-048d8525d31e?w=800&q=80",
        type: "talent",
        stage_id: "primary",
        category_id: "individual-sports",
        created_by: adminData.id,
      },
    ];

    // Insert example content
    const { error } = await supabase.from("content").insert(exampleContent);

    if (error) {
      console.error("Error adding example content:", error);
      return;
    }

    console.log("Example content added successfully!");
  } catch (error) {
    console.error("Error in addExampleContent:", error);
  }
}

// Run the function
addExampleContent();
