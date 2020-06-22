import React from "react";
import ReactDOM from "react-dom";
import { data, totalTrackLength } from "./sampleData";
import "./styles.css";

/**
 * @point {object} object of { start: x, end: x }
 * @width {string} eg: 10px , 10%
 * @height {string} eg: 10px, 10%
 * @backgroundColor {string} : eg: #e3e3e3, red
 * @textColor {string}: eg: #e3e3e3, red
 * @textSize {string}: eg: 10px, 10em
 * @position {object}: object of { x: x, y: x }
 * @rounded {string}: eg: 3px, 100%
 */
const TimelineSegmentsItem = React.memo(
	({
		point = { start: 0, end: 0 },
		position = { x: 0, y: 0 },
		width = "0px",
		height = "0px",
		backgroundColor = "#fff",
		textColor = "#000",
		textSize = "14px",
		rounded = "3px",
	}) => {
		const style = {
			width,
			height,
			backgroundColor,
			color: textColor,
			fontSize: textSize,
			left: position.x,
			top: position.y,
			borderRadius: rounded,
		};

		return (
			<div style={style} className="timelineSegmentsItem">
				<span>{point.start}</span>
				<span>{point.end}</span>
			</div>
		);
	},
);

// sort point follow start , if start point equal , we use end point to sort
const sortTimelinePoint = (a, b) => {
	return a.start - b.start || a.end - b.end;
};
// find depth of node
const findDepth = (items, itemIndex) => {
	let currentDepth = 0;
	let currentItem = items[itemIndex];
	for (let i = 0; i < itemIndex; i++) {
		if (items[i].end > currentItem.start) {
			const depth = items[i].depth || currentDepth;
			currentDepth = depth + 1;
		}
	}
	return currentDepth;
};
// calc width of item follow percent
const calcPercent = (total, number) => (number / total) * 100;

// assume all data is valid and sorted by start time
const TimelineSegments = React.memo(({ data, totalTrackLength }) => {
	const items = [...data].sort(sortTimelinePoint);
	const itemsLength = items.length;
	let maxDepth = 0;

	for (let i = 0; i < itemsLength; i++) {
		const depth = findDepth(items, i);
		items[i].depth = depth;
		if (maxDepth < depth) {
			maxDepth = depth;
		}
	}

	const width = "100%";
	const spacingBetweenItem = 5; // 10px
	const heightItem = 10; // 10px
	const heightContainer =
		(maxDepth + 1) * (heightItem + spacingBetweenItem) - spacingBetweenItem;
	const containerStyle = {
		width,
		height: `${heightContainer}px`,
	};

	return (
		<div className="container">
			<div style={containerStyle} className="timelineSegments">
				{items.map((value) => {
					const width = calcPercent(
						totalTrackLength,
						value.end - value.start,
					);
					const position = {
						x: `${calcPercent(totalTrackLength, value.start)}%`,
						y: `${
							value.depth * (heightItem + spacingBetweenItem)
						}px`,
					};

					return (
						<TimelineSegmentsItem
							key={value.id}
							width={`${width}%`}
							height={`${heightItem}px`}
							position={position}
							point={{ start: value.start, end: value.end }}
							backgroundColor="darkgray"
							rounded="5px"
							textColor="#fff"
						/>
					);
				})}
			</div>
		</div>
	);
});

// boilerplate
ReactDOM.render(
	<TimelineSegments data={data} totalTrackLength={totalTrackLength} />,
	document.getElementById("root"),
);
