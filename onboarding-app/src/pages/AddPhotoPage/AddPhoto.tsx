import {PhotoUploader} from "@/pages/AddPhotoPage/PhotoUploader.tsx";

export default function AddPhotoPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Pridávanie fotiek pacientov</h1>
            <PhotoUploader/>
        </div>
    )
}