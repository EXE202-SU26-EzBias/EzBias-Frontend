import { createPortal } from 'react-dom';
import { useCallHub } from '../../features/video-call/useCallHub';
import IncomingCallModal from './IncomingCallModal';
import VideoCallWindow from './VideoCallWindow';

const VideoCallRoot = () => {
  useCallHub();

  return createPortal(
    <>
      <IncomingCallModal />
      <VideoCallWindow />
    </>,
    document.body,
  );
};

export default VideoCallRoot;
