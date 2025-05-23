/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        // Text Styles
        "h1-semibold": ["61px", { lineHeight: "1.5", fontWeight: "600" }],
        "h1-bold": ["61px", { lineHeight: "1.5", fontWeight: "700" }],
        "h1-extrabold": ["61px", { lineHeight: "1.5", fontWeight: "800" }],
        "h1-s-semibold": ["54px", { lineHeight: "1.5", fontWeight: "600" }],
        "h1-s-bold": ["54px", { lineHeight: "1.5", fontWeight: "700" }],
        "h1-s-extrabold": ["54px", { lineHeight: "1.5", fontWeight: "800" }],

        "h2-semibold": ["48px", { lineHeight: "1.5", fontWeight: "600" }],
        "h2-bold": ["48px", { lineHeight: "1.5", fontWeight: "700" }],
        "h2-extrabold": ["48px", { lineHeight: "1.5", fontWeight: "800" }],
        "h2-s-semibold": ["42px", { lineHeight: "1.5", fontWeight: "600" }],
        "h2-s-bold": ["42px", { lineHeight: "1.5", fontWeight: "700" }],
        "h2-s-extrabold": ["42px", { lineHeight: "1.5", fontWeight: "800" }],

        "h3-semibold": ["39px", { lineHeight: "1.5", fontWeight: "600" }],
        "h3-bold": ["39px", { lineHeight: "1.5", fontWeight: "700" }],
        "h3-extrabold": ["39px", { lineHeight: "1.5", fontWeight: "800" }],
        "h3-s-semibold": ["34px", { lineHeight: "1.5", fontWeight: "600" }],
        "h3-s-bold": ["34px", { lineHeight: "1.5", fontWeight: "700" }],
        "h3-s-extrabold": ["34px", { lineHeight: "1.5", fontWeight: "800" }],

        "h4-semibold": ["31px", { lineHeight: "1.5", fontWeight: "600" }],
        "h4-bold": ["31px", { lineHeight: "1.5", fontWeight: "700" }],
        "h4-extrabold": ["31px", { lineHeight: "1.5", fontWeight: "800" }],
        "h4-s-semibold": ["27px", { lineHeight: "1.5", fontWeight: "600" }],
        "h4-s-bold": ["27px", { lineHeight: "1.5", fontWeight: "700" }],
        "h4-s-extrabold": ["27px", { lineHeight: "1.5", fontWeight: "800" }],

        "h5-semibold": ["25px", { lineHeight: "1.5", fontWeight: "600" }],
        "h5-bold": ["25px", { lineHeight: "1.5", fontWeight: "700" }],
        "h5-extrabold": ["25px", { lineHeight: "1.5", fontWeight: "800" }],
        "h5-s-semibold": ["21px", { lineHeight: "1.5", fontWeight: "600" }],
        "h5-s-bold": ["21px", { lineHeight: "1.5", fontWeight: "700" }],
        "h5-s-extrabold": ["21px", { lineHeight: "1.5", fontWeight: "800" }],

        "h6-semibold": ["20px", { lineHeight: "1.5", fontWeight: "600" }],
        "h6-bold": ["20px", { lineHeight: "1.5", fontWeight: "700" }],
        "h6-extrabold": ["20px", { lineHeight: "1.5", fontWeight: "800" }],
        "h6-s-semibold": ["17.5px", { lineHeight: "1.5", fontWeight: "600" }],
        "h6-s-bold": ["17.5px", { lineHeight: "1.5", fontWeight: "700" }],
        "h6-s-extrabold": ["17.5px", { lineHeight: "1.5", fontWeight: "800" }],

        "paragraph-light": ["16px", { lineHeight: "1.5", fontWeight: "300" }],
        "paragraph-regular": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "paragraph-medium": ["16px", { lineHeight: "1.5", fontWeight: "500" }],
        "paragraph-semibold": ["16px", { lineHeight: "1.5", fontWeight: "600" }],
        "paragraph-s-light": ["14px", { lineHeight: "1.5", fontWeight: "300" }],
        "paragraph-s-regular": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "paragraph-s-medium": ["14px", { lineHeight: "1.5", fontWeight: "500" }],
        "paragraph-s-semibold": ["14px", { lineHeight: "1.5", fontWeight: "600" }],

        "caption-light": ["12.5px", { lineHeight: "1.5", fontWeight: "300" }],
        "caption-regular": ["12.5px", { lineHeight: "1.5", fontWeight: "400" }],
        "caption-medium": ["12.5px", { lineHeight: "1.5", fontWeight: "500" }],
        "caption-semibold": ["12.5px", { lineHeight: "1.5", fontWeight: "600" }],
        "caption-bold": ["12.5px", { lineHeight: "1.5", fontWeight: "700" }],

        "footer-light": ["11.5px", { lineHeight: "1.5", fontWeight: "300" }],
        "footer-regular": ["11.5px", { lineHeight: "1.5", fontWeight: "400" }],
        "footer-medium": ["11.5px", { lineHeight: "1.5", fontWeight: "500" }],
        "footer-semibold": ["11.5px", { lineHeight: "1.5", fontWeight: "600" }],
        "footer-bold": ["11.5px", { lineHeight: "1.5", fontWeight: "700" }],
      },
      colors: {
        background: "#EFF3F6",
        body: "#64748B",
        bodydark: "#AEB7C0",
        bodydark1: "#DEE4EE",
        bodydark2: "#8A99AF",
        primary: "#3C50E0",
        secondary: "#80CAEE",
        stroke: "#E2E8F0",
        graydark: "#333A48",
        whiten: "#F1F5F9",
        whiter: "#F5F7FD",
        boxdark: "#24303F",
        "boxdark-2": "#1A222C",
        strokedark: "#2E3A47",
        "form-strokedark": "#3d4d60",
        "form-input": "#1d2a39",

        neutral: {
          50: "#F0F3F7",
          100: "#E0E6EF",
          200: "#D1DAE8",
          300: "#C1CDE0",
          400: "#B2C1D8",
          500: "#A2B4D0",
          600: "#7993BB",
          700: "#5373A4",
          800: "#3E567B",
          900: "#293952",
        },
        primary: {
          50: "#DEF3FF",
          100: "#BDE7FF",
          200: "#9CDBFF",
          300: "#7ACEFF",
          400: "#59C2FF",
          500: "#38B6FF",
          600: "#04A3FF",
          700: "#0083CF",
          800: "#00629C",
          900: "#004268",
        },
        secondary: {
          50: "#CBDFFF",
          100: "#97BFFF",
          200: "#63A0FF",
          300: "#2F80FF",
          400: "#0061FA",
          500: "#004DC6",
          600: "#0040A5",
          700: "#003384",
          800: "#002663",
          900: "#001A42",
        },
        success: {
          50: "#CBFAEA",
          100: "#96F5D5",
          200: "#62F0C0",
          300: "#2DECAB",
          400: "#13CC8D",
          500: "#0E9869",
          600: "#0C7F58",
          700: "#096546",
          800: "#074C35",
          900: "#053323",
        },
        warning: {
          50: "#FDEBCD",
          100: "#FBD69A",
          200: "#F8C268",
          300: "#F6AE35",
          400: "#EC970A",
          500: "#BA7708",
          600: "#9B6307",
          700: "#7C4F05",
          800: "#5D3C04",
          900: "#3E2803",
        },
        error: {
          50: "#F6DEDE",
          100: "#ECBCBD",
          200: "#E39B9B",
          300: "#D97A7A",
          400: "#D05859",
          500: "#C53839",
          600: "#A42F2F",
          700: "#832526",
          800: "#621C1C",
          900: "#421313",
        },
        shades: {
          light: "#FFFFFF",
          dark: "#1C2434",
        },
      },
    },
  },
  plugins: [],
};
