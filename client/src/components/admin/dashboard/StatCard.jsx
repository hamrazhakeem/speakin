import React from "react";
import PropTypes from "prop-types";

const StatCard = ({ title, value, subtext, icon: Icon, tooltip }) => (
	<div className="bg-black rounded-lg border border-zinc-800 p-6">
		<div className="flex items-start justify-between">
			<div>
				<div className="flex items-center gap-2">
					<p className="text-sm text-zinc-400">{title}</p>
					{tooltip && (
						<span className="text-zinc-500 cursor-help" title={tooltip}>
							ⓘ
						</span>
					)}
				</div>
				<h3 className="text-2xl font-bold text-white mt-2">{value}</h3>
				{subtext && <p className="text-sm text-zinc-500 mt-1">{subtext}</p>}
			</div>
			{Icon && (
				<div className="p-3 bg-zinc-900 rounded-lg">
					<Icon className="w-6 h-6 text-white" />
				</div>
			)}
		</div>
	</div>
);

StatCard.propTypes = {
	title: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
	icon: PropTypes.elementType.isRequired,
	trend: PropTypes.bool,
	trendValue: PropTypes.number,
};

export default StatCard;
