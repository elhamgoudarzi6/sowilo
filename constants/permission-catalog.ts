export const PERMISSION_CATALOG = [
  {
    module: "profiles",
    moduleLabel: "پروفایل‌ها",
    permissions: [
      {
        code: "profiles.read",
        name: "مشاهده پروفایل",
        description: "مشاهده اطلاعات پروفایل",
      },
      {
        code: "profiles.create",
        name: "ایجاد پروفایل",
        description: "ایجاد پروفایل جدید",
      },
      {
        code: "profiles.update",
        name: "ویرایش پروفایل",
        description: "ویرایش اطلاعات پروفایل",
      },
      {
        code: "profiles.delete",
        name: "حذف پروفایل",
        description: "حذف پروفایل",
      },
    ],
  },
  {
    module: "applications",
    moduleLabel: "درخواست‌ها",
    permissions: [
      {
        code: "applications.read",
        name: "مشاهده درخواست‌ها",
        description: "مشاهده اطلاعات درخواست‌ها",
      },
      {
        code: "applications.create",
        name: "ایجاد درخواست",
        description: "ثبت درخواست جدید",
      },
      {
        code: "applications.update",
        name: "ویرایش درخواست",
        description: "ویرایش اطلاعات درخواست",
      },
      {
        code: "applications.delete",
        name: "حذف درخواست",
        description: "حذف درخواست",
      },
    ],
  },
  {
    module: "files",
    moduleLabel: "فایل‌ها",
    permissions: [
      {
        code: "files.read",
        name: "مشاهده فایل‌ها",
        description: "مشاهده فایل‌ها و اطلاعات آن‌ها",
      },
      {
        code: "files.upload",
        name: "بارگذاری فایل",
        description: "بارگذاری فایل در سیستم",
      },
      {
        code: "files.delete",
        name: "حذف فایل",
        description: "حذف فایل از سیستم",
      },
    ],
  },
  {
    module: "users",
    moduleLabel: "کاربران",
    permissions: [
      {
        code: "users.read",
        name: "مشاهده کاربران",
        description: "مشاهده اطلاعات کاربران",
      },
      {
        code: "users.create",
        name: "ایجاد کاربر",
        description: "ایجاد کاربر جدید",
      },
      {
        code: "users.update",
        name: "ویرایش کاربر",
        description: "ویرایش اطلاعات کاربران",
      },
      {
        code: "users.delete",
        name: "حذف کاربر",
        description: "حذف کاربر",
      },
      {
        code: "users.change.password",
        name: "تغییر رمز عبور کاربر",
        description: "امکان تغییر رمز عبور حساب کاربری کاربر",
      },
    ],
  },
  {
    module: "startups",
    moduleLabel: "استارتاپ‌ها",
    permissions: [
      {
        code: "startups.read",
        name: "مشاهده استارتاپ‌ها",
        description: "مشاهده اطلاعات استارتاپ‌ها",
      },
      {
        code: "startups.create",
        name: "ایجاد استارتاپ",
        description: "ثبت استارتاپ جدید",
      },
      {
        code: "startups.update",
        name: "ویرایش استارتاپ",
        description: "ویرایش اطلاعات استارتاپ",
      },
      {
        code: "startups.delete",
        name: "حذف استارتاپ",
        description: "حذف استارتاپ",
      },
    ],
  },
  {
    module: "startup.reports",
    moduleLabel: "گزارش‌های استارتاپ",
    permissions: [
      {
        code: "startup.reports.read",
        name: "مشاهده گزارش‌های استارتاپ",
        description: "مشاهده اطلاعات و گزارش‌های استارتاپ",
      },
      {
        code: "startup.reports.create",
        name: "ایجاد گزارش استارتاپ",
        description: "ثبت گزارش جدید برای استارتاپ",
      },
      {
        code: "startup.reports.update",
        name: "ویرایش گزارش استارتاپ",
        description: "ویرایش اطلاعات و محتوای گزارش استارتاپ",
      },
      {
        code: "startup.reports.delete",
        name: "حذف گزارش استارتاپ",
        description: "حذف گزارش استارتاپ",
      },
    ],
  },
  {
    module: "startup.documents",
    moduleLabel: "اسناد استارتاپ",
    permissions: [
      {
        code: "startup.documents.read",
        name: "مشاهده اسناد استارتاپ",
        description: "مشاهده اسناد و مدارک استارتاپ",
      },
      {
        code: "startup.documents.create",
        name: "ایجاد سند استارتاپ",
        description: "ثبت یا بارگذاری سند جدید برای استارتاپ",
      },
      {
        code: "startup.documents.update",
        name: "ویرایش سند استارتاپ",
        description: "ویرایش اطلاعات و مشخصات سند استارتاپ",
      },
      {
        code: "startup.documents.delete",
        name: "حذف سند استارتاپ",
        description: "حذف سند و مدرک استارتاپ",
      },
    ],
  },
  {
    module: "tickets",
    moduleLabel: "تیکت‌ها",
    permissions: [
      {
        code: "tickets.read",
        name: "مشاهده تیکت‌ها",
        description: "مشاهده اطلاعات تیکت‌ها",
      },
      {
        code: "tickets.create",
        name: "ایجاد تیکت",
        description: "ثبت تیکت جدید",
      },
      {
        code: "tickets.update",
        name: "ویرایش تیکت",
        description: "ویرایش اطلاعات تیکت",
      },
      {
        code: "tickets.delete",
        name: "حذف تیکت",
        description: "حذف تیکت",
      },
      {
        code: "tickets.reply",
        name: "پاسخ به تیکت",
        description: "ارسال پاسخ و پیام در تیکت‌ها",
      },
    ],
  },
  {
    module: "blogs",
    moduleLabel: "وبلاگ‌ها",
    permissions: [
      {
        code: "blogs.read",
        name: "مشاهده مطالب وبلاگ",
        description: "مشاهده مطالب وبلاگ",
      },
      {
        code: "blogs.create",
        name: "ایجاد مطلب وبلاگ",
        description: "انتشار مطلب جدید در وبلاگ",
      },
      {
        code: "blogs.update",
        name: "ویرایش مطلب وبلاگ",
        description: "ویرایش مطالب وبلاگ",
      },
      {
        code: "blogs.delete",
        name: "حذف مطلب وبلاگ",
        description: "حذف مطلب وبلاگ",
      },
    ],
  },
  {
    module: "news",
    moduleLabel: "اخبار",
    permissions: [
      {
        code: "news.read",
        name: "مشاهده اخبار",
        description: "مشاهده اخبار منتشرشده",
      },
      {
        code: "news.create",
        name: "ایجاد خبر",
        description: "ثبت خبر جدید",
      },
      {
        code: "news.update",
        name: "ویرایش خبر",
        description: "ویرایش اطلاعات خبر",
      },
      {
        code: "news.delete",
        name: "حذف خبر",
        description: "حذف خبر",
      },
    ],
  },
  {
    module: "events",
    moduleLabel: "رویدادها",
    permissions: [
      {
        code: "events.read",
        name: "مشاهده رویدادها",
        description: "مشاهده اطلاعات رویدادها",
      },
      {
        code: "events.create",
        name: "ایجاد رویداد",
        description: "ثبت رویداد جدید",
      },
      {
        code: "events.update",
        name: "ویرایش رویداد",
        description: "ویرایش اطلاعات رویداد",
      },
      {
        code: "events.delete",
        name: "حذف رویداد",
        description: "حذف رویداد",
      },
    ],
  },
  {
    module: "notifications",
    moduleLabel: "اعلان‌ها",
    permissions: [
      {
        code: "notifications.read",
        name: "مشاهده اعلان‌ها",
        description: "مشاهده اعلان‌ها",
      },
      {
        code: "notifications.create",
        name: "ایجاد اعلان",
        description: "ایجاد اعلان جدید",
      },
      {
        code: "notifications.update",
        name: "ویرایش اعلان",
        description: "ویرایش اطلاعات و وضعیت اعلان‌ها",
      },
      {
        code: "notifications.delete",
        name: "حذف اعلان",
        description: "حذف اعلان",
      },
    ],
  },
  {
    module: "admins",
    moduleLabel: "مدیران",
    permissions: [
      {
        code: "admins.read",
        name: "مشاهده مدیران",
        description: "مشاهده اطلاعات مدیران سیستم",
      },
      {
        code: "admins.create",
        name: "ایجاد مدیر",
        description: "ایجاد حساب مدیر جدید",
      },
      {
        code: "admins.update",
        name: "ویرایش مدیر",
        description: "ویرایش اطلاعات و دسترسی‌های مدیر",
      },
      {
        code: "admins.delete",
        name: "حذف مدیر",
        description: "حذف حساب مدیر",
      },
      {
        code: "admins.change.username",
        name: "تغییر نام کاربری مدیر",
        description: "امکان تغییر نام کاربری حساب کاربری مدیر",
      },
      {
        code: "admins.change.password",
        name: "تغییر رمز عبور مدیر",
        description: "امکان تغییر رمز عبور حساب کاربری مدیر",
      },
    ],
  },
  {
    module: "contact.messages",
    moduleLabel: "پیام‌های تماس با ما",
    permissions: [
      {
        code: "contact.messages.read",
        name: "مشاهده پیام‌های تماس با ما",
        description: "مشاهده پیام‌هایی که کاربران از طریق فرم تماس با ما در وب‌سایت ارسال کرده‌اند",
      },
      {
        code: "contact.messages.create",
        name: "ثبت پیام تماس با ما",
        description: "ثبت دستی پیام جدید در بخش پیام‌های تماس با ما",
      },
      {
        code: "contact.messages.delete",
        name: "حذف پیام‌های تماس با ما",
        description: "حذف پیام‌های دریافتی از طریق فرم تماس با ما",
      },
    ],
  },
  {
    module: "mentor.requests",
    moduleLabel: "درخواست‌های منتورینگ",
    permissions: [
      {
        code: "mentor.requests.read",
        name: "مشاهده درخواست‌های منتورینگ",
        description: "مشاهده درخواست‌های ثبت‌شده برای دریافت خدمات منتورینگ",
      },
      {
        code: "mentor.requests.create",
        name: "ثبت درخواست منتورینگ",
        description: "ثبت درخواست جدید برای دریافت خدمات منتورینگ",
      },
      {
        code: "mentor.requests.delete",
        name: "حذف درخواست‌های منتورینگ",
        description: "حذف درخواست‌های ثبت‌شده برای دریافت خدمات منتورینگ",
      },
    ],
  },
] as const;
