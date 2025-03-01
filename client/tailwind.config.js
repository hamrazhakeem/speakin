/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
	darkMode: "class",
	plugins: [
		function ({ addUtilities }) {
			addUtilities({
				".no-scrollbar": {
					"&::-webkit-scrollbar": {
						display: "none",
					},
					"-ms-overflow-style": "none",
					"scrollbar-width": "none",
				},
				".scrollbar-thin": {
					"&::-webkit-scrollbar": {
						width: "6px",
					},
					"&::-webkit-scrollbar-track": {
						background: "#f1f5f9",
						borderRadius: "8px",
					},
					"&::-webkit-scrollbar-thumb": {
						background: "#94a3b8",
						borderRadius: "8px",
						"&:hover": {
							background: "#64748b",
						},
					},
				},
			});
		},
	],
};
