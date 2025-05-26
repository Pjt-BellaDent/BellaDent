import React from 'react';
import styled from '@emotion/styled';
import { useHospitalInfo } from '../contexts/HospitalContext';

// styled 컴포넌트는 컴포넌트 바깥에서 정의
const FooterWrapper = styled.footer`
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  flex-grow: 0;
  flex-shrink: 0;
`;

const Container = styled.div`
  width: 1440px;
  margin: 0 auto;
  text-align: center;

  h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  p {
    margin: 4px 0;
  }
`;

function Footer() {
  const { hospitalInfo } = useHospitalInfo(); // 전역 병원 정보

  return (
    <FooterWrapper>
      <Container>
        <h3>{hospitalInfo.name}</h3>
        <p>
          주소: {hospitalInfo.address} | 대표자명: {hospitalInfo.ceo} | 사업자등록번호: {hospitalInfo.bizNumber}
        </p>
        <p>
          Tel: {hospitalInfo.phone} | Copyright ⓒ 2025 {hospitalInfo.name}. All rights reserved.
        </p>
        <p className="mt-5">Marketing Management By team A</p>
      </Container>
    </FooterWrapper>
  );
}

export default Footer;
