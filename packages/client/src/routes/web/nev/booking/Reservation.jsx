import React from 'react';
import LineImageBanner from '../../../../components/web/LineImageBanner';
import Title from '../../../../components/web/Title';
import Text from '../../../../components/web/Text';

import line_banner from '../../../../assets/images/line_banner.png';

function Reservation() {
  return (
    <>
      <LineImageBanner
        CN="w-full h-40 flex justify-center items-center overflow-hidden"
        image={line_banner}
      >
        {' '}
        <div className="flex flex-col justify-center items-center mt-16 mb-3 mx-5">
          <Title
            as="h1"
            size="lg"
            CN="text-center text-BD-CharcoalBlack text-shadow-lg/20"
          >
            Reservation
          </Title>
          <Text size="md" CN="text-center">
            Reservation
          </Text>
        </div>
      </LineImageBanner>
      <div>Reservation</div>
    </>
  );
}

export default Reservation;
