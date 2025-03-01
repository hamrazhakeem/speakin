import { ChevronDown, ChevronUp } from "lucide-react";

const FaqItem = ({ question, answer, isActive, onClick }) => (
	<div
		className={`
      border-b border-gray-200 last:border-0 
      transform transition-all duration-200 
      ${isActive ? "bg-blue-50/50" : "hover:bg-gray-50"}
    `}
	>
		<button
			className="w-full py-6 px-6 text-left flex justify-between items-center focus:outline-none group"
			onClick={onClick}
		>
			<span
				className={`text-lg font-medium ${
					isActive ? "text-blue-600" : "text-gray-900"
				} group-hover:text-blue-600 transition-colors`}
			>
				{question}
			</span>
			<div
				className={`ml-4 flex-shrink-0 p-2 rounded-full ${
					isActive ? "bg-blue-100" : "bg-gray-100"
				} group-hover:bg-blue-100 transition-colors`}
			>
				{isActive ? (
					<ChevronUp
						className={`w-5 h-5 ${
							isActive ? "text-blue-600" : "text-gray-500"
						}`}
					/>
				) : (
					<ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
				)}
			</div>
		</button>
		<div
			className={`
      overflow-hidden transition-all duration-300 ease-in-out
      ${isActive ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
    `}
		>
			<p className="px-6 pb-6 text-gray-600 leading-relaxed">{answer}</p>
		</div>
	</div>
);

export default FaqItem;
