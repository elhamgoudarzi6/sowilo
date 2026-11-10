
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";

import Image from "next/image";

import {
  TbSearch,
  TbArrowUpLeft,
  TbMicrophone,
} from "react-icons/tb";

import type { ReactNode } from "react";

// ---------------------------------------------
// Types
// ---------------------------------------------

type MockProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
};

type SpeechRecognitionAlternative = {
  transcript: string;
};

type SpeechRecognitionResult = {
  readonly length: number;
  readonly isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
};

type SpeechRecognitionEvent = {
  resultIndex: number;
  results: {
    readonly length: number;
    [index: number]: SpeechRecognitionResult;
  };
};

type SpeechRecognitionErrorEvent = {
  error: string;
  message?: string;
};

type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;

  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;

  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

// ---------------------------------------------
// Mock Products
// ---------------------------------------------

const mockProducts: MockProduct[] = [
  {
    id: "1",
    name: "هدفون بی‌سیم سونی",
    slug: "sony-wireless-headphones",
    price: 3850000,
    image: "/images/2.jpg",
    category: "دیجیتال",
  },
  {
    id: "2",
    name: "ساعت هوشمند اسپرت",
    slug: "sport-smart-watch",
    price: 2450000,
    image: "/images/3.jpg",
    category: "ساعت",
  },
  {
    id: "3",
    name: "کیف دستی زنانه",
    slug: "womens-handbag",
    price: 1790000,
    image: "/images/1.jpg",
    category: "کیف و اکسسوری",
  },
  {
    id: "4",
    name: "کفش روزمره مردانه",
    slug: "mens-casual-shoes",
    price: 2180000,
    image: "/images/2.jpg",
    category: "کفش",
  },
  {
    id: "5",
    name: "اسپیکر بلوتوثی",
    slug: "bluetooth-speaker",
    price: 1290000,
    image: "/images/3.jpg",
    category: "دیجیتال",
  },
  {
    id: "6",
    name: "عطر زنانه",
    slug: "womens-perfume",
    price: 3200000,
    image: "/images/4.jpg",
    category: "زیبایی و مراقبت",
  },
  {
    id: "7",
    name: "تی‌شرت مردانه",
    slug: "mens-basic-tshirt",
    price: 590000,
    image: "/images/5.jpg",
    category: "مردانه",
  },
  {
    id: "8",
    name: "چراغ خواب مدرن",
    slug: "modern-bedside-lamp",
    price: 890000,
    image: "/images/6.jpg",
    category: "خانه و آشپزخانه",
  },
];

// ---------------------------------------------
// Search Helpers
// ---------------------------------------------

function normalizeText(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("fa-IR")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, " ");
}

function searchMockProducts(query: string): MockProduct[] {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) return [];

  const words = normalizedQuery.split(/\s+/).filter(Boolean);

  return mockProducts
    .map((product) => {
      const searchableText = normalizeText(
        `${product.name} ${product.category}`,
      );

      const matchedWords = words.filter((word) =>
        searchableText.includes(word),
      ).length;

      return {
        product,
        score: matchedWords,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((item) => item.product);
}

function formatPrice(price: number): string {
  return `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;
}

// ---------------------------------------------
// Main Component
// ---------------------------------------------

export default function BaseAutocomplete() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [open, setOpen] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const shouldListenRef = useRef(false);

  const silenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const options = useMemo(
    () => searchMockProducts(query),
    [query],
  );

  // ---------------------------------------------
  // Timer Helpers
  // ---------------------------------------------

  const clearSilenceTimeout = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  };

  const clearRestartTimeout = () => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
  };

  // ---------------------------------------------
  // Stop Voice Search
  // ---------------------------------------------

  const stopListening = () => {
    shouldListenRef.current = false;

    clearSilenceTimeout();
    clearRestartTimeout();

    const recognition = recognitionRef.current;

    // قبل از stop مرجع را پاک می‌کنیم تا onend
    // نمونه قبلی باعث شروع مجدد ضبط نشود.
    recognitionRef.current = null;

    try {
      recognition?.stop();
    } catch {
      // Ignore
    }

    setIsListening(false);
  };

  // ---------------------------------------------
  // Silence Timer (3 Seconds)
  // ---------------------------------------------

  const startSilenceTimer = () => {
    clearSilenceTimeout();

    silenceTimeoutRef.current = setTimeout(() => {
      stopListening();
    }, 3000);
  };

  // ---------------------------------------------
  // Update Search Query
  // ---------------------------------------------

  const updateQuery = (value: string) => {
    setQuery(value);
    setOpen(Boolean(value.trim()));
  };

  // ---------------------------------------------
  // Restart Recognition
  // ---------------------------------------------

  const restartRecognition = (
    recognition: SpeechRecognitionInstance,
  ) => {
    if (!shouldListenRef.current) return;

    if (recognitionRef.current !== recognition) return;

    try {
      recognition.start();
    } catch (error) {
      // جلوگیری از شروع مجدد در صورت فعال بودن نمونه قبلی
      console.error("Speech recognition restart error:", error);
    }
  };

  // ---------------------------------------------
  // Start Voice Search
  // ---------------------------------------------

  const startVoiceSearch = () => {
    if (shouldListenRef.current) return;

    // Speech Recognition به اتصال امن نیاز دارد.
    if (!window.isSecureContext) {
      alert(
        "برای استفاده از جست‌وجوی صوتی، سایت باید با HTTPS باز شود.",
      );
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("مرورگر شما از جست‌وجوی صوتی پشتیبانی نمی‌کند.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();

      recognition.lang = "fa-IR";

      // تنظیمات سازگارتر با Safari و Chrome
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognitionRef.current = recognition;
      shouldListenRef.current = true;

      clearSilenceTimeout();
      clearRestartTimeout();

      // ---------------------------------------------
      // Recognition Started
      // ---------------------------------------------

      recognition.onstart = () => {
        if (
          shouldListenRef.current &&
          recognitionRef.current === recognition
        ) {
          setIsListening(true);
        }
      };

      // ---------------------------------------------
      // Recognition Result
      // ---------------------------------------------

      recognition.onresult = (event) => {
        if (!shouldListenRef.current) return;

        if (recognitionRef.current !== recognition) return;

        let transcript = "";

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i++
        ) {
          const result = event.results[i];

          if (result.isFinal) {
            transcript += result[0].transcript + " ";
          }
        }

        const recognizedText = transcript.trim();

        if (recognizedText) {
          updateQuery(recognizedText);

          // با دریافت متن جدید، تایمر سکوت از نو شروع می‌شود.
          startSilenceTimer();
        }
      };

      // ---------------------------------------------
      // Recognition Error
      // ---------------------------------------------

      recognition.onerror = (event) => {
        if (recognitionRef.current !== recognition) return;

        console.error("Speech recognition error:", event.error);

        switch (event.error) {
          case "not-allowed":
          case "service-not-allowed":
            stopListening();

            alert(
              "دسترسی میکروفون یا تشخیص گفتار در تنظیمات مرورگر مجاز نیست.",
            );
            break;

          case "audio-capture":
          case "not-found":
            stopListening();

            alert("میکروفون در دسترس نیست.");
            break;

          case "network":
            stopListening();

            alert("ارتباط با سرویس تشخیص گفتار برقرار نشد.");
            break;

          case "language-not-supported":
            stopListening();

            alert("تشخیص گفتار فارسی در این مرورگر در دسترس نیست.");
            break;

          case "no-speech":
            // ممکن است کاربر هنوز شروع به صحبت نکرده باشد.
            // onend در صورت فعال بودن، ضبط را مجدداً شروع می‌کند.
            break;

          case "aborted":
            // خطای لغو ضبط؛ در صورت توقف دستی کاری انجام نمی‌دهیم.
            break;

          default:
            stopListening();
            alert("در تشخیص گفتار مشکلی رخ داد. دوباره تلاش کن.");
            break;
        }
      };

      // ---------------------------------------------
      // Recognition Ended
      // ---------------------------------------------

      recognition.onend = () => {
        if (!shouldListenRef.current) {
          setIsListening(false);
          return;
        }

        if (recognitionRef.current !== recognition) return;

        clearRestartTimeout();

        // Safari و Chrome ممکن است بعد از هر عبارت
        // یک بار recognition را متوقف کنند.
        // در این حالت تا وقتی کاربر ضبط را متوقف نکرده،
        // مجدداً شروع می‌کنیم.

        restartTimeoutRef.current = setTimeout(() => {
          restartRecognition(recognition);
        }, 500);
      };

      // ---------------------------------------------
      // Start
      // ---------------------------------------------

      // این فراخوانی مستقیماً از رویداد کلیک انجام می‌شود
      // تا محدودیت‌های مجوز مرورگر رعایت شوند.
      recognition.start();

      setIsListening(true);

    } catch (error) {
      console.error("Speech recognition start error:", error);

      stopListening();

      alert("شروع جست‌وجوی صوتی امکان‌پذیر نیست.");
    }
  };

  // ---------------------------------------------
  // Select Product
  // ---------------------------------------------

  const handleSelect = (product: MockProduct | null) => {
    if (!product) return;

    stopListening();

    setOpen(false);
    updateQuery("");

    router.push(`/products/${product.slug}`);
  };

  // ---------------------------------------------
  // Cleanup
  // ---------------------------------------------

  useEffect(() => {
    return () => {
      shouldListenRef.current = false;

      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }

      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }

      const recognition = recognitionRef.current;

      recognitionRef.current = null;

      try {
        recognition?.abort();
      } catch {
        // Ignore
      }
    };
  }, []);

  // ---------------------------------------------
  // Render
  // ---------------------------------------------

  return (
    <div dir="rtl" className="w-full min-w-0">
      <Autocomplete<MockProduct, false, false, false>
        options={options}
        value={null}
        inputValue={query}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        forcePopupIcon={false}
        openOnFocus={false}
        clearOnBlur={false}
        filterOptions={(items) => items}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) =>
          option.id === value.id
        }
        onInputChange={(_, value, reason) => {
          if (reason === "input" || reason === "clear") {
            updateQuery(value);
          }
        }}
        onChange={(_, product) => handleSelect(product)}
        noOptionsText={
          query.trim()
            ? "محصولی با این نام پیدا نشد"
            : "نام محصول موردنظرت رو بنویس"
        }
        slots={{
          paper: AutocompletePaper,
        }}
        renderOption={(props, product) => {
          const { key, ...optionProps } = props;

          return (
            <li
              key={key}
              {...optionProps}
              className="flex! items-center! gap-3! px-3! py-3!"
            >
              <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-(--color-background)">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-(--color-text)">
                  {product.name}
                </p>

                <p className="font-extralight text-xs text-(--color-text-secondary)">
                  {product.category}
                </p>

                <p className="mt-1 text-xs font-bold text-(--color-primary)">
                  {formatPrice(product.price)}
                </p>
              </div>

              <TbArrowUpLeft
                size={18}
                aria-hidden="true"
                className="shrink-0 text-(--color-text-secondary)"
              />
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="چی می‌خوای پیدا کنی؟"
            slotProps={{
              ...params.slotProps,
              htmlInput: {
                ...params.slotProps?.htmlInput,
                "aria-label": "جست‌وجوی محصولات",
              },
              input: {
                ...params.slotProps?.input,

                // Search Icon
                startAdornment: (
                  <>
                    <InputAdornment position="start">
                      <TbSearch
                        size={21}
                        aria-hidden="true"
                        className="text-(--color-primary)"
                      />
                    </InputAdornment>

                    {params.slotProps?.input?.startAdornment}
                  </>
                ),

                // Microphone Icon
                endAdornment: (
                  <>
                    <InputAdornment position="end">
                      <IconButton
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={startVoiceSearch}
                        edge="end"
                        aria-label={
                          isListening
                            ? "در حال ضبط"
                            : "شروع ضبط"
                        }
                        aria-pressed={isListening}
                        sx={{
                          width: 36,
                          height: 36,
                          color: isListening
                            ? "var(--color-primary)"
                            : "var(--color-text-secondary)",
                          transition: "color 200ms ease",
                        }}
                      >
                        <TbMicrophone
                          size={22}
                          className={
                            isListening
                              ? "search-mic-active"
                              : ""
                          }
                        />
                      </IconButton>
                    </InputAdornment>

                    {params.slotProps?.input?.endAdornment}
                  </>
                ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                minHeight: 48,
                borderRadius: "16px",
                backgroundColor: "var(--color-background)",
                paddingInline: "12px",
                fontFamily: "var(--font-primary)",
                fontSize: "13px",

                "& fieldset": {
                  borderColor: "var(--color-border)",
                },

                "&:hover fieldset": {
                  borderColor: "var(--color-primary)",
                  opacity: 0.3,
                },

                "&.Mui-focused fieldset": {
                  borderColor: "var(--color-primary)",
                  borderWidth: "1px",
                  opacity: 0.3,
                },
              },

              "& .MuiInputBase-input": {
                textAlign: "right",
                fontFamily: "var(--font-primary)",
              },

              "& .MuiInputBase-input::placeholder": {
                color: "var(--color-text-secondary)",
                opacity: 1,
              },
            }}
          />
        )}
      />
    </div>
  );
}

// ---------------------------------------------
// Autocomplete Paper
// ---------------------------------------------

function AutocompletePaper({
  children,
  ...props
}: React.ComponentProps<typeof Paper> & {
  children?: ReactNode;
}) {
  return (
    <Paper
      {...props}
      elevation={0}
      sx={{
        mt: 1,
        overflow: "hidden",
        border: "1px solid var(--color-border)",
        borderRadius: "18px",
        backgroundColor: "var(--color-surface)",
        boxShadow: "0 18px 45px rgba(48, 33, 36, 0.12)",

        "& .MuiAutocomplete-listbox": {
          padding: "6px",
          maxHeight: 360,
          fontFamily: "var(--font-primary)",
        },

        "& .MuiAutocomplete-option": {
          borderRadius: "12px",
          textAlign: "right",

          "&[aria-selected='true']": {
            backgroundColor:
              "color-mix(in srgb, var(--color-primary) 8%, transparent)",
          },

          "&.Mui-focused": {
            backgroundColor: "var(--color-background)",
          },
        },

        "& .MuiAutocomplete-noOptions": {
          fontFamily: "var(--font-primary)",
          textAlign: "right",
        },
      }}
    >
      {children}
    </Paper>
  );
}
