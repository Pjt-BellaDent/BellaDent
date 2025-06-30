import React from 'react';
import ChatForm from '../../../../components/web/ChatForm';
import LineImageBanner from '../../../../components/web/LineImageBanner';
import Title from '../../../../components/web/Title';
import Text from '../../../../components/web/Text';

import line_banner from '../../../../assets/images/line_banner.png';

function LiveChat() {
  return (
    <>
      <LineImageBanner
        CN="w-full h-30 flex justify-center items-center overflow-hidden object-cover"
        image={line_banner}
      >
        <Title
          as="h2"
          size="lg"
          CN="text-center text-BD-CharcoalBlack text-shadow-lg/20"
        >
          실시간 상담
        </Title>
        <Text size="md" CN="text-center">
          LiveChat
        </Text>
      </LineImageBanner>
      <ChatForm />
    </>
  );
}

export default LiveChat;
