<script lang="ts">
	import ImagePreviewCard from '$lib/components/ImagePreviewCard.svelte';
	import { FileDropzone } from '@skeletonlabs/skeleton';

	export let formData = {
		thumbnail: [] as unknown as FileList,
		pictures: [] as unknown as FileList
	};

	export let formInvalid;
	$: formInvalid = formData.thumbnail.length !== 1 || formData.pictures.length < 1;

	const previews = {
		thumbnail: [] as Array<string>,
		pictures: [] as Array<string>
	};

	const handleThumbnailUpload = async () => {
		for (let i = 0; i < formData.thumbnail.length; i++) {
			const reader = new FileReader();
			reader.onload = () => {
				previews.thumbnail[i] = URL.createObjectURL(formData.thumbnail[i]);
			};
			reader.readAsDataURL(formData.thumbnail[i]);
		}
	};

	const handlePictureUpload = () => {
		for (let i = 0; i < formData.pictures.length; i++) {
			const reader = new FileReader();
			reader.onload = () => {
				previews.pictures[i] = URL.createObjectURL(formData.pictures[i]);
			};
			reader.readAsDataURL(formData.pictures[i]);
		}
	};
</script>

<form class="grid grid-cols-3 gap-4">
	<div>
		<FileDropzone
			bind:files={formData.thumbnail}
			on:change={handleThumbnailUpload}
			accept="image/*"
			name="thumbnail"
		>
			<svelte:fragment slot="lead">
				<span style="font-size: 64px;" class="material-symbols-outlined">wallpaper</span>
			</svelte:fragment>
			<svelte:fragment slot="message">Upload Event Thumbnail</svelte:fragment>
			<svelte:fragment slot="meta">(This will be displayed as preview image)</svelte:fragment>
		</FileDropzone>
	</div>
	<div>
		<!-- <span>You can drag the image on the area</span> -->
		<p>Note:</p>
		<ul class="ml-4 list-disc">
			<li>It is mandatory to upload a thumbnail image</li>
			<li>You can only upload one thumbnail image</li>
			<li>Recommended aspect ratio: 16:9</li>
			<li>Recommended resolution: 640x360</li>
			<li>The image will be cropped and resized to meet the above requirements</li>
		</ul>
	</div>
	<div class="row-span-2">
		<span class="font-bold">Uploaded Files</span>
		<div class="mt-4 flex flex-col gap-5">
			{#each formData.thumbnail as thumbnail, i}
				<ImagePreviewCard name={thumbnail.name} imageUrl={previews.thumbnail[i]} />
			{/each}
			{#each formData.pictures as picture, i}
				<ImagePreviewCard name={picture.name} imageUrl={previews.pictures[i]} />
			{/each}
		</div>
	</div>
	<div>
		<FileDropzone
			bind:files={formData.pictures}
			on:change={handlePictureUpload}
			accept="image/*"
			name="pictures"
			multiple
		>
			<svelte:fragment slot="lead">
				<span style="font-size: 64px;" class="material-symbols-outlined">panorama</span>
			</svelte:fragment>
			<svelte:fragment slot="message">Upload Event Pictures</svelte:fragment>
			<svelte:fragment slot="meta">(These will be displayed on details page)</svelte:fragment>
		</FileDropzone>
	</div>
	<div>
		<p>Note:</p>
		<ul class="ml-4 list-disc">
			<li>You can upload minimum 1 and maximum of 4 images</li>
			<li>Recommended aspect ratio: 16:9</li>
			<li>Recommended resolution: 1280x720</li>
			<li>The image will be cropped and resized to meet the above requirements</li>
		</ul>
	</div>
</form>
