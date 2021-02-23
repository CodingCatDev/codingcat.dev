import CloudinaryUpload from '@/components/admin/CloudinaryUpload';
import VideoFormModal from '@/components/admin/VideoFormModal';

import ImageModal from '@/components/admin/ImageModal';
import VideoModal from '@/components/admin/VideoModal';

export default function EditPostMedia(): JSX.Element {
  return (
    <section className="grid grid-cols-1 gap-4">
      <section className="flex flex-wrap space-x-4">
        <div className="grid gap-2 place-items-center text-primary-900">
          <h3 className="font-sans text-2xl bold">Default Image</h3>
          <img src="" alt="" width="400px" height="250px" />
        </div>
        <div className="grid gap-2 place-items-center text-primary-900">
          <h3 className="font-sans text-2xl bold">Default Video</h3>
          {/* For some reason this is showing up in the browser as 400x200, not sure if it's aspect ratio or what, but may need to be restyled after video is coded in. */}
          <video width="400" height="250">
            <source src="" type="video/mp4" />
          </video>
        </div>
      </section>
      <section>
        <header className="flex justify-between space-x-4">
          <nav className="flex">
            {/* Going to need some state here to determine which tab it's on */}
            <button className="px-4 py-2 uppercase rounded-t-lg font-2xl bold text-basics-50 dark:text-basics-50 bg-primary-900 dark:bg-primary-900">
              Images
            </button>
            <button className="px-4 py-2 uppercase rounded-t-lg text-primary-900 dark:text-primary-900 font-2xl bold bg-basics-50 dark:bg-basics-50">
              Videos
            </button>
          </nav>
          <div className="flex">
            <button className="flex space-x-4 btn-primary">
              <svg
                className="w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>{' '}
              Upload Media
            </button>
            <select></select>
          </div>
        </header>
        <section className="grid w-full h-full gap-4 p-4 overflow-y-auto bg-basics-50 dark:bg-basics-800 grid-cols-fit lg:max-h-96">
          <img src="" alt="" width="300px" height="150px" />
          <img src="" alt="" width="300px" height="150px" />
          <img src="" alt="" width="300px" height="150px" />
          <img src="" alt="" width="300px" height="150px" />
          <img src="" alt="" width="300px" height="150px" />
          <img src="" alt="" width="300px" height="150px" />
          <img src="" alt="" width="300px" height="150px" />
          <img src="" alt="" width="300px" height="150px" />
          <img src="" alt="" width="300px" height="150px" />
          <img src="" alt="" width="300px" height="150px" />
          <img src="" alt="" width="300px" height="150px" />
          <img src="" alt="" width="300px" height="150px" />
        </section>
      </section>
      {/* {history && (
            <>
              <VideoModal post={history} />
              <CloudinaryUpload
                setHistory={setHistory}
                history={history}
                type={MediaType.video}
              />
              <VideoFormModal setHistory={setHistory} post={history} />
              {history.coverPhoto ? (
                <ImageModal post={history} />
              ) : (
                <CloudinaryUpload
                  setHistory={setHistory}
                  history={history}
                  type={MediaType.photo}
                />
              )}
            </>
          )} */}
    </section>
  );
}
