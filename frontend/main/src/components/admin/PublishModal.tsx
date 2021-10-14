import { useEffect, useState } from 'react';
import { Post } from '@/models/post.model';

import { Calendar } from 'primereact/calendar';

export default function PublishModal({
  history,
  onPublish,
}: {
  history: Post;
  onPublish: (selectedDate: Date) => Promise<void>;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [largeButton, setLargeButton] = useState(true);

  useEffect(() => {
    if (!history) {
      return;
    }
    if (history.publishedAt) {
      setSelectedDate(history.publishedAt.toDate());
    } else {
      setSelectedDate(new Date());
    }
  }, [history]);

  const handleClickOpen = () => {
    setOpen(true);
    setLargeButton(false);
  };
  // const handleClose = () => {
  //   setOpen(false);
  // };

  const handleDateChange = (date: Date | null) => {
    if (date) setSelectedDate(date);
  };

  function onCancel() {
    setOpen(false);
    setLargeButton(true);
  }

  const onPublishModal = async () => {
    await onPublish(selectedDate);
    setLargeButton(true);
    setOpen(false);
  };

  return (
    <div>
      {largeButton && (
        <button
          className="flex items-center justify-center w-full h-16 uppercase btn-primary"
          onClick={handleClickOpen}
        >
          <p>Publish</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{
              height: '1.5rem',
              width: '1.5rem',
              marginLeft: '1rem',
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
        </button>
      )}

      <section className={`${open ? 'grid grid-cols-1 gap-2' : 'hidden'}`}>
        <p>Select Post Date/Time</p>
        <div style={{ height: '100%', width: '100%' }}>
          {selectedDate ? (
            <Calendar
              showTime
              hourFormat="24"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.value as Date)}
            ></Calendar>
          ) : (
            <p>Checking Post for publishedAt...</p>
          )}
        </div>
        <div className="flex space-x-4">
          <button onClick={() => onCancel()} className="btn-secondary">
            Cancel
          </button>
          <button onClick={() => onPublishModal()} className="btn-primary">
            Publish
          </button>
        </div>
      </section>
    </div>
  );
}
