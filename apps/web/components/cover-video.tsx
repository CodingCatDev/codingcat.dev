interface CoverVideoProps {
    cloudinaryVideo: any;
    className?: string;
}

export default function CoverVideo(props: CoverVideoProps) {
    const { cloudinaryVideo, className } = props;

    // After migration, cloudinaryVideo is { _type: "file", asset: { _ref: "file-xxx-ext" } }
    // We need to construct the URL from the asset ref
    const assetRef = cloudinaryVideo?.asset?._ref;
    
    if (!assetRef) {
        return (
            <div className="transition-shadow duration-200 shadow-md group-hover:shadow-lg sm:mx-0">
                <div className="bg-slate-50" style={{ paddingTop: "50%" }} />
            </div>
        );
    }

    // Sanity file asset references follow the format: file-{id}-{extension}
    // e.g., "file-abc123def456-mp4" → https://cdn.sanity.io/files/{projectId}/{dataset}/abc123def456.mp4
    const parts = assetRef.split('-');
    const ext = parts.pop();
    const hash = parts.slice(1).join('-');
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
    const videoUrl = `https://cdn.sanity.io/files/${projectId}/${dataset}/${hash}.${ext}`;

    return (
        <div className="transition-shadow duration-200 shadow-md group-hover:shadow-lg sm:mx-0">
            <video
                className={className ?? "w-full h-auto"}
                width={1920}
                height={1080}
                controls
                preload="metadata"
            >
                <source src={videoUrl} />
            </video>
        </div>
    );
}
