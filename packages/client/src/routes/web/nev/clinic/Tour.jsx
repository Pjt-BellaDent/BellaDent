import { useState } from 'react';

import LineBanner from '../../../../components/web/LineBanner';
import Container from '../../../../components/web/Container';
import Title from '../../../../components/web/Title';
import Text from '../../../../components/web/Text';
import ImageBox from '../../../../components/web/ImageBox';

import image_280_210 from '../../../../assets/images/dummy/image_280_210.png';

function Tour() {
  const [thumbnail, setThumbnail] = useState(image_280_210);
  const bg_image_02 = [
    image_280_210,
    image_280_210,
    image_280_210,
    image_280_210,
  ];
  return (
    <>
      <LineBanner CN="w-full h-40 bg-gray-400 flex flex-col justify-center items-center">
        <Title CN="text-4xl text-center">Welcome to Our Clinic</Title>
        <Text CN="text-xl text-center">Your health is our priority</Text>
      </LineBanner>
      <Container CN="py-40">
        <div className="px-5">
          <img
            src={thumbnail}
            alt={thumbnail}
            className="w-full object-cover rounded-4xl"
          />
        </div>
        <ImageBox
          images={bg_image_02}
          setThumbnail={setThumbnail}
          CN="w-full mx-auto flex flex-wrap px-5 justify-between pt-20"
        />
      </Container>
    </>
  );
}

export default Tour;
