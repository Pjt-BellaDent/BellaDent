import React from 'react';
import styled from '@emotion/styled';

function Footer() {
  const Footer = styled.footer`
    width: 100%;
    height: 200px;
    background-color: #f0f0f0;
    flex-grow: 0;
    flex-shrink: 0;
  `;
  const Container = styled.div`
    width: 1440px;
    margin: 0 auto;
  `;

  return (
    <Footer>
      <Container className="text-center">
        <h3 className="text-xl mb-5">벨라덴치과</h3>
        <p>
          주소: 광주광역시 남구 봉선중앙로 102, 벨라메디타워 4층 | 대표자명:
          이서윤 | 사업자등록번호: 847-12-34567
        </p>
        <p>
          Tel: 062-987-6543 | Copyright ⓒ 2025 벨라덴치과. All rights reserved.
        </p>
        <p className="mt-5">Marketing Management By team A</p>
      </Container>
    </Footer>
  );
}

export default Footer;
