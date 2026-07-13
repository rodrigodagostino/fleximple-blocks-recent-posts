import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	BaseControl,
	PanelBody,
	Placeholder,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
	ToolbarGroup,
} from '@wordpress/components';
import { useDebounce, useInstanceId } from '@wordpress/compose';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';

import PostSortableControl from './components/post-sortable-control';
import RecentPostsPreview from './components/recent-posts-preview';
// import RecentPostsSelectControl from './components/recent-posts-select-control';
import QueryControls from 'fleximple-components/components/query-controls';
import HeadingLevelDropdown from 'fleximple-components/components/heading-level-dropdown';
import HeadingLevelToolbar from 'fleximple-components/components/heading-level-toolbar';
import SpacingControl from 'fleximple-components/components/spacing-control';
import Spinner from 'fleximple-components/components/spinner';
import ResponsiveSettingsTabPanel from 'fleximple-components/components/responsive-settings-tab-panel';
import { setResponsiveAttribute } from '../utils';

import './editor.scss';

const CATEGORIES_LIST_QUERY = {
	per_page: -1,
	_fields: 'id,name',
	context: 'view',
};
const MAX_POSTS_COLUMNS = 6;

export default function RecentPostsEdit({
	className,
	attributes,
	attributes: {
		layout,
		columns,
		gapColumn,
		gapRow,
		headingLevel,
		excerptLength,
		noFollow,
		noReferrer,
		postsToShow,
		offset,
		categories,
		excludedCategories,
		order,
		orderBy,
		imageWidth,
		imageSize,
		aspectRatio,
		displayMedia,
		displayFeaturedImage,
		displayExcerpt,
		displayReadMore,
		readMore,
	},
	setAttributes,
	clientId,
}) {
	const instanceId = useInstanceId(RecentPostsEdit);

	// RangeControl fires onChange on every drag tick, not just on release
	// (see https://github.com/WordPress/gutenberg/issues/10168). postsToShow
	// and offset feed straight into the useSelect query below, so dragging
	// either slider was firing a new REST request per pixel of movement.
	// The slider itself still tracks postsToShow live via setAttributes —
	// only the value driving the query is debounced.
	const debouncedSetQueryDeps = useDebounce((value) => setQueryDeps(value), 250);
	const [queryDeps, setQueryDeps] = useState({ postsToShow, offset });
	useEffect(() => {
		debouncedSetQueryDeps({ postsToShow, offset });
	}, [postsToShow, offset, debouncedSetQueryDeps]);

	const { imageSizes, categoriesList } = useSelect(
		(select) => {
			const { getEntityRecords } = select(coreStore);
			const settings = select(blockEditorStore).getSettings();

			return {
				imageSizes: settings.imageSizes,
				categoriesList: getEntityRecords('taxonomy', 'category', CATEGORIES_LIST_QUERY),
			};
		},
		[imageSize]
	);

	const { recentPosts, hasResolved } = useSelect(
		(select) => {
			const { getEntityRecords, hasFinishedResolution } = select(coreStore);
			const catIds = categories && categories.length > 0 ? categories.map((cat) => cat.value) : [];
			const excludedCatIds =
				excludedCategories && excludedCategories.length > 0
					? excludedCategories.map((cat) => cat.value)
					: [];
			const recentPostsQuery = Object.fromEntries(
				Object.entries({
					categories: catIds,
					categories_exclude: excludedCatIds,
					order,
					orderby: orderBy,
					per_page: queryDeps.postsToShow,
					offset: queryDeps.offset,
					_embed: 'author,wp:featuredmedia',
					ignore_sticky: true,
				}).filter(([, value]) => typeof value !== 'undefined')
			);

			return {
				recentPosts: getEntityRecords('postType', 'post', recentPostsQuery),
				hasResolved: hasFinishedResolution('getEntityRecords', [
					'postType',
					'post',
					recentPostsQuery,
				]),
			};
		},
		[queryDeps, categories, excludedCategories, order, orderBy]
	);

	const mediaItems = recentPosts
		? recentPosts.map((post) => post._embedded?.['wp:featuredmedia']?.[0] ?? null)
		: null;

	useEffect(() => {
		if (!attributes.className) {
			setAttributes({ className: 'is-style-standard' });
		}
	}, []);

	useEffect(() => {
		if (attributes.blockId !== clientId) setAttributes({ blockId: clientId });
	}, [clientId]);

	const hasPosts = Array.isArray(recentPosts) && recentPosts.length;
	const inspectorControls = (
		<InspectorControls>
			<PanelBody title={__('Main', 'fleximple-blocks-recent-posts')}>
				<RangeControl
					label={__('Number of items', 'fleximple-blocks-recent-posts')}
					value={postsToShow}
					min={1}
					max={100}
					__next40pxDefaultSize
					onChange={(value) => setAttributes({ postsToShow: value })}
					required
				/>
				<ResponsiveSettingsTabPanel initialTabName="large">
					{(tab) => (
						<>
							{layout === 'grid' && (
								<RangeControl
									className="gap-v-small"
									label={__('Columns', 'fleximple-blocks-recent-posts')}
									value={columns[tab.name]}
									min={1}
									max={
										!hasPosts ? MAX_POSTS_COLUMNS : Math.min(MAX_POSTS_COLUMNS, recentPosts.length)
									}
									__next40pxDefaultSize
									onChange={(value) => {
										setResponsiveAttribute(attributes, setAttributes, 'columns', tab.name, value);
									}}
									required
								/>
							)}
							{layout === 'grid' && (
								<SpacingControl
									valueLabel={__('Column gap', 'fleximple-blocks-recent-posts')}
									unitLabel={__('Column gap unit', 'fleximple-blocks-recent-posts')}
									className="gap-v-small"
									initialPosition={0}
									min={0}
									max={200}
									attribute={gapColumn}
									target={tab.name}
									onChange={(value) => setAttributes({ gapColumn: value })}
								/>
							)}
							<SpacingControl
								valueLabel={__('Row gap', 'fleximple-blocks-recent-posts')}
								unitLabel={__('Row gap unit', 'fleximple-blocks-recent-posts')}
								initialPosition={0}
								min={0}
								max={200}
								attribute={gapRow}
								target={tab.name}
								onChange={(value) => setAttributes({ gapRow: value })}
							/>
						</>
					)}
				</ResponsiveSettingsTabPanel>
				<BaseControl
					label={__('Heading level', 'fleximple-blocks-recent-posts')}
					id={`fleximple-blocks-recent-posts-heading-control-${instanceId}`}
				>
					<HeadingLevelToolbar
						id={`fleximple-blocks-recent-posts-heading-control-${instanceId}`}
						minLevel={1}
						maxLevel={7}
						selectedLevel={headingLevel}
						onChange={(value) => setAttributes({ headingLevel: value })}
						isCollapsed={false}
					/>
				</BaseControl>
				{displayExcerpt && (
					<RangeControl
						label={__('Max number of words in excerpt', 'fleximple-blocks-recent-posts')}
						value={excerptLength}
						min={10}
						max={100}
						__next40pxDefaultSize
						onChange={(value) => setAttributes({ excerptLength: value })}
					/>
				)}
				<ToggleControl
					label={__('“nofollow” attribute', 'fleximple-blocks-recent-posts')}
					checked={!!noFollow}
					onChange={() => setAttributes({ noFollow: !noFollow })}
					help={
						!noFollow
							? __(
									'Google search spider should follow the links to these posts.',
									'fleximple-blocks-recent-posts'
								)
							: __(
									'Google search spider should not follow the links to these posts.',
									'fleximple-blocks-recent-posts'
								)
					}
				/>
				<ToggleControl
					label={__('“noreferrer” attribute', 'fleximple-blocks-recent-posts')}
					checked={!!noReferrer}
					onChange={() => setAttributes({ noReferrer: !noReferrer })}
					help={
						!noReferrer
							? __(
									'The browser should send an HTTP referer header if the user follows the hyperlink.',
									'fleximple-blocks-recent-posts'
								)
							: __(
									'The browser should not send an HTTP referer header if the user follows the hyperlink.',
									'fleximple-blocks-recent-posts'
								)
					}
				/>
			</PanelBody>
			<PanelBody
				title={__('Sorting and filtering', 'fleximple-blocks-recent-posts')}
				initialOpen={false}
			>
				<QueryControls
					{...{ offset, order, orderBy }}
					numberOfItems={postsToShow}
					categoriesList={categoriesList}
					selectedCategories={categories}
					selectedExcludedCategories={excludedCategories}
					onNumberOfItemsChange={(value) => setAttributes({ postsToShow: value })}
					onOffsetChange={(value) => setAttributes({ offset: value })}
					onCategoriesChange={(selectedOptions) => setAttributes({ categories: selectedOptions })}
					onExcludedCategoriesChange={(selectedOptions) =>
						setAttributes({ excludedCategories: selectedOptions })
					}
					onOrderChange={(value) => setAttributes({ order: value })}
					onOrderByChange={(value) => setAttributes({ orderBy: value })}
				/>
				{/* <ToggleControl
          label={__('Manually select posts', 'fleximple-blocks-recent-posts')}
          checked={selectManually}
          onChange={() => setAttributes({ selectManually: !selectManually })}
        />
        {!!selectManually && (
          <RecentPostsSelectControl {...{ attributes, setAttributes }} />
        )} */}
			</PanelBody>
			{!!displayMedia && !!displayFeaturedImage && (
				<PanelBody title={__('Media', 'fleximple-blocks-recent-posts')} initialOpen={false}>
					{'list' === layout && (
						<RangeControl
							className="gap-v-small"
							label={__('Image width', 'fleximple-blocks-recent-posts')}
							value={imageWidth}
							min={10}
							max={90}
							__next40pxDefaultSize
							onChange={(value) => setAttributes({ imageWidth: value })}
						/>
					)}
					<ResponsiveSettingsTabPanel initialTabName="medium">
						{(tab) => (
							<>
								<SelectControl
									label={__('Image size', 'fleximple-blocks-recent-posts')}
									value={imageSize[tab.name]}
									options={[
										{
											label: __('None', 'fleximple-blocks-recent-posts'),
											value: 'none',
										},
										...imageSizes.map((size) => ({
											label: size.name,
											value: size.slug,
										})),
									]}
									__next40pxDefaultSize
									onChange={(value) => {
										setResponsiveAttribute(attributes, setAttributes, 'imageSize', tab.name, value);
									}}
								/>
								<SelectControl
									label={__('Aspect ratio', 'fleximple-blocks-recent-posts')}
									value={aspectRatio[tab.name]}
									options={[
										{ label: 'None', value: 'none' },
										{ label: '1:1', value: '1-1' },
										{ label: '5:4', value: '5-4' },
										{ label: '4:3', value: '4-3' },
										{ label: '3:2', value: '3-2' },
										{ label: '16:10', value: '16-10' },
										{ label: '16:9', value: '16-9' },
										{ label: '2:1', value: '2-1' },
										{ label: '3:1', value: '3-1' },
									]}
									__next40pxDefaultSize
									onChange={(value) => {
										setResponsiveAttribute(
											attributes,
											setAttributes,
											'aspectRatio',
											tab.name,
											value
										);
									}}
								/>
							</>
						)}
					</ResponsiveSettingsTabPanel>
				</PanelBody>
			)}
			<PanelBody title={__('Display', 'fleximple-blocks-recent-posts')} initialOpen={false}>
				<PostSortableControl {...{ attributes, setAttributes }} />
				{!!displayReadMore && (
					<TextControl
						label={__('Read more text', 'fleximple-blocks-recent-posts')}
						value={readMore}
						onChange={(value) => setAttributes({ readMore: value })}
					/>
				)}
			</PanelBody>
		</InspectorControls>
	);

	if (!hasResolved) {
		return (
			<>
				<Placeholder
					className={`fleximple-components-placeholder ${!Array.isArray(recentPosts) ? 'is-loading' : ''}`}
				>
					<Spinner />
					<p>{__('Loading…', 'fleximple-blocks-recent-posts')}</p>
				</Placeholder>
			</>
		);
	}

	if (!hasPosts) {
		return (
			<>
				{inspectorControls}
				<Placeholder
					className={`fleximple-components-placeholder ${!Array.isArray(recentPosts) ? 'is-loading' : ''}`}
				>
					{__('No posts found.', 'fleximple-blocks-recent-posts')}
				</Placeholder>
			</>
		);
	}

	// Removing posts from display should be instant.
	const posts = recentPosts.length > postsToShow ? recentPosts.slice(0, postsToShow) : recentPosts;
	// if (selectManually && selectedPostsIds.length > 0) {
	//   postsData =
	//     recentPosts.length > postsToShow
	//       ? recentPosts.slice(0, postsToShow)
	//       : recentPosts
	// }

	const layoutControls = [
		{
			icon: 'list-view',
			title: __('List view', 'fleximple-blocks-recent-posts'),
			onClick: () => setAttributes({ layout: 'list' }),
			isActive: 'list' === layout,
		},
		{
			icon: 'grid-view',
			title: __('Grid view', 'fleximple-blocks-recent-posts'),
			onClick: () => setAttributes({ layout: 'grid' }),
			isActive: 'grid' === layout,
		},
	];

	return (
		<>
			{inspectorControls}
			<BlockControls>
				<HeadingLevelDropdown
					selectedLevel={headingLevel}
					onChange={(value) => setAttributes({ headingLevel: value })}
				/>

				<ToolbarGroup controls={layoutControls} />
			</BlockControls>
			<RecentPostsPreview posts={posts} mediaItems={mediaItems} {...{ className, attributes }} />
		</>
	);
}
