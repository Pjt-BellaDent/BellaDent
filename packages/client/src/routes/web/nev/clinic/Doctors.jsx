import { useState } from 'react';
import ScrollFadeIn from '../../../../components/web/ScrollFadeIn';

import LineImageBanner from '../../../../components/web/LineImageBanner';
import LineBanner from '../../../../components/web/LineBanner';
import Wrapper from '../../../../components/web/Wrapper';
import Container from '../../../../components/web/Container';
import Card from '../../../../components/web/Card';
import Title from '../../../../components/web/Title';
import Text from '../../../../components/web/Text';
import Button from '../../../../components/web/Button';
import RowBox from '../../../../components/web/RowBox';
import ImageBox from '../../../../components/web/ImageBox';

import line_banner from '../../../../assets/images/line_banner.png';
import doctor_1_sec_1_1 from '../../../../assets/images/doctor_1_sec_1_1.png';
import doctor_1_sec_1_2 from '../../../../assets/images/doctor_1_sec_1_2.png';
import doctor_2_sec_1_1 from '../../../../assets/images/doctor_2_sec_1_1.png';
import doctor_2_sec_1_2 from '../../../../assets/images/doctor_2_sec_1_2.png';
import doctor_3_sec_1_1 from '../../../../assets/images/doctor_3_sec_1_1.png';
import doctor_3_sec_1_2 from '../../../../assets/images/doctor_3_sec_1_2.png';
import doctor_sec_1_1 from '../../../../assets/images/doctor_sec_1_1.png';
import doctor_sec_1_2 from '../../../../assets/images/doctor_sec_1_2.png';
import doctor_sec_1_3 from '../../../../assets/images/doctor_sec_1_3.png';
import doctor_sec_1_4 from '../../../../assets/images/doctor_sec_1_4.png';
import doctor_sec_1_5 from '../../../../assets/images/doctor_sec_1_5.png';
import doctor_sec_1_6 from '../../../../assets/images/doctor_sec_1_6.png';
import doctor_sec_1_7 from '../../../../assets/images/doctor_sec_1_7.png';
import doctor_sec_1_8 from '../../../../assets/images/doctor_sec_1_8.png';
import doctor_sec_1_9 from '../../../../assets/images/doctor_sec_1_9.png';

function Doctors() {
  const [activeTab, setActiveTab] = useState('doctor1');
  const bg_image_02 = [
    doctor_sec_1_1,
    doctor_sec_1_2,
    doctor_sec_1_3,
    doctor_sec_1_4,
    doctor_sec_1_5,
    doctor_sec_1_6,
    doctor_sec_1_7,
    doctor_sec_1_8,
    doctor_sec_1_9,
  ];

    const doctorImages = {
    doctor1: {
      card: doctor_1_sec_1_1,
      banner: doctor_1_sec_1_2,
    },
    doctor2: {
      card: doctor_2_sec_1_1,
      banner: doctor_2_sec_1_2,
    },
    doctor3: {
      card: doctor_3_sec_1_1,
      banner: doctor_3_sec_1_2,
    },
  };

  return (
    <>
      <LineImageBanner
        CN="w-full h-40 flex justify-center items-center overflow-hidden"
        image={line_banner}
      >
        <div className="flex flex-col justify-center items-center">
          <Title CN="text-4xl text-center">Welcome to Our Clinic</Title>
          <Text CN="text-xl text-center">Your health is our priority</Text>{' '}
        </div>
      </LineImageBanner>

      <Container CN="pt-20">
        <ul className="flex justify-center items-center pb-40 divide-x-2">
          <li
            className="w-80 py-2 text-xl text-center cursor-pointer"
            onClick={() => setActiveTab('doctor1')}
          >
            정하늘 대표원장
          </li>
          <li
            className="w-80 py-2 text-xl text-center cursor-pointer"
            onClick={() => setActiveTab('doctor2')}
          >
            김수민 부원장
          </li>
          <li
            className="w-80 py-2 text-xl text-center cursor-pointer"
            onClick={() => setActiveTab('doctor3')}
          >
            박정우 과장
          </li>
        </ul>

        <Card
          image={doctorImages[activeTab]?.card}
          CN="px-5 flex flex-row-reverse justify-between gap-12 pb-120"
        >
          <Title CN="text-4xl text-center">Welcome to Our Clinic</Title>
          <Text CN="text-xl text-center">Your health is our priority</Text>
          <Title CN="text-2xl text-center">Welcome to Our Clinic</Title>
          <Text CN="text-xl text-center">Your health is our priority</Text>
        </Card>
        <ScrollFadeIn delay={0.5}>
          <Title CN="text-4xl text-center pb-10">Welcome to Our Clinic</Title>
        </ScrollFadeIn>
      </Container>

      <LineBanner CN="w-full h-40 bg-gray-400 flex justify-center">
        <div className="w-320 mx-auto flex justify-between items-end">
          <RowBox CN="h-full items-center gap-4">
            <Text CN="text-xl text-center">Your health is our priority</Text>
            <Text CN="text-xl text-center">Your health is our priority</Text>
          </RowBox>
          <div>
            <img
              src={doctorImages[activeTab]?.banner}
              alt={doctorImages[activeTab]?.banner}
              className="max-w-100"
            />
          </div>
        </div>
      </LineBanner>

      <Wrapper CN="pt-20 pb-40">
        <hr />
        <Container CN="py-10">
          <RowBox>
            <div>
              <Text CN="text-lg">text</Text>
              <Title CN="text-4xl">title</Title>
              <Button CN="px-6 py-2 rounded bg-BD-ElegantGold text-BD-CharcoalBlack hover:bg-BD-CharcoalBlack hover:text-BD-PureWhite duration-300 mt-4">
                button
              </Button>
            </div>
            <div>
              <Text CN="text-xl text-center">Your health is our priority</Text>
            </div>
          </RowBox>
        </Container>
        <hr />
        <Container>
          <ImageBox
            images={bg_image_02}
            CCN="w-full mx-auto flex flex-wrap justify-between gap-4 pt-20"
            CN="max-w-[calc((100%-2rem)/3)]"
          />
        </Container>
      </Wrapper>
    </>
  );
}

export default Doctors;
