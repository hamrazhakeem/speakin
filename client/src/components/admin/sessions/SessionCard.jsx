import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { format, isValid } from 'date-fns';

const formatTime = (timeStr) => {
  if (!timeStr) return 'N/A';
  const date = new Date(timeStr);
  return isValid(date) ? format(date, 'MMM dd, yyyy hh:mm a') : 'Invalid Date';
};

const formatStatus = (status) => 
  status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown';

const ParticipantStatus = ({ role, joined, joinTime }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-zinc-400">{role}</span>
    <div className="flex items-center gap-2">
      {joinTime && <span className="text-white">{formatTime(joinTime)}</span>}
      {joined ? (
        <CheckCircle2 className="w-4 h-4 text-green-500" />
      ) : (
        <>
          <div className='text-white'>Not joined</div>
          <XCircle className="w-4 h-4 text-red-500" />
        </>
      )}
    </div>
  </div>
);

const SessionCard = ({ session, type, users }) => {
  const user = type === 'availability' 
    ? users.tutors[session.tutor_id]
    : users.students[session.student_id];

  const startTime = session.start_time || session.availabilityDetails?.start_time;
  const endTime = session.end_time || session.availabilityDetails?.end_time;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-zinc-800 overflow-hidden">
            {user?.profile_image ? (
              <img 
                src={user.profile_image}
                alt={user?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white bg-zinc-700">
                {user?.name?.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-white">
              {type === 'availability'
                ? user?.tutor_details?.speakin_name
                : user?.name || 'Unknown User'}
            </h3>
            <p className="text-sm text-zinc-400">{user?.email || 'No email'}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {type === 'availability' ? (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Status:</span>
              <span className="text-white">
                {session.is_booked ? 'Booked' : 'Available'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Language:</span>
              <span className="text-white">{session.language_to_teach}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Start Time:</span>
              <span className="text-white">{formatTime(startTime)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">End Time:</span>
              <span className="text-white">{formatTime(endTime)}</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Status:</span>
              <span className="text-white">{formatStatus(session.booking_status)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Availability ID:</span>
              <span className="text-white">{session.availability}</span>
            </div>
            <div className="text-sm text-zinc-400 mt-4 mb-2">Participant Status:</div>
            <div className="space-y-2">
              <ParticipantStatus
                role="Student"
                joined={session.student_joined_within_5_min}
                joinTime={session.student_joined_at}
              />
              <ParticipantStatus
                role="Tutor"
                joined={session.tutor_joined_within_5_min}
                joinTime={session.tutor_joined_at}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SessionCard;
