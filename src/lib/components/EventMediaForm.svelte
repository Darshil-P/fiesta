<script>
	import { FileDropzone } from '@skeletonlabs/skeleton';
</script>

<div class="grid grid-cols-3 gap-4">
	<div>
		<FileDropzone name="files" class="">
			<svelte:fragment slot="lead">
				<span style="font-size: 64px;" class="material-symbols-outlined">wallpaper</span>
			</svelte:fragment>
			<svelte:fragment slot="message">Upload Event Thumbnail</svelte:fragment>
			<svelte:fragment slot="meta">(This will be displayed as preview image)</svelte:fragment>
		</FileDropzone>
	</div>
	<div>Drag a file to Upload</div>
	<div class="row-span-2">
		<span class="font-bold">Uploaded Files</span>
	</div>
	<div>
		<FileDropzone name="files" multiple>
			<svelte:fragment slot="lead">
				<span style="font-size: 64px;" class="material-symbols-outlined">panorama</span>
			</svelte:fragment>
			<svelte:fragment slot="message">Upload Event Pictures</svelte:fragment>
			<svelte:fragment slot="meta">(These will be displayed on details page)</svelte:fragment>
		</FileDropzone>
	</div>
	<div>Upload upto 5 Images</div>
</div>
