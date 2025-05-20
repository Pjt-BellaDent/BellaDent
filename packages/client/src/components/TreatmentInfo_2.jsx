import React from 'react';
import './TreatmentInfo_2.css';

function TreatmentInfo_2() {
  return (
    <div className="treatment_container">
      <title>non-covered items</title>
      <div>
        <br />

        <br />
        <h2>
          <b>비급여 항목 안내</b>
        </h2>
        <hr />
        <h3 className='text'>제증명수수료</h3>
        <p>
          1. 증명서 발급 당일 기본 1통에 대한 기준임 / 부수적인 검진료는 별도로
          함
        </p>
        <p>
          2. 기본 1통 이외에 추가발급을 요할 때는 추가 1통당 1,000원. 접수료,
          진찰료 등은 별도로 산정하지 못함
        </p>
        <table className="table">
          <tr>
            <th className="col1">구분</th>
            <th className="col2">비급여항목</th>
            <th className="col1">금액</th>
            <th className="col1">비고</th>
          </tr>
          <tr>
            <td rowSpan={10}>
              제증명서
              <br />
              발급수수료
            </td>
            <td>일반진단서</td>
            <td>20,000원</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>상해진단서(3주미만)</td>
            <td>100,000원</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>상해진단서(3주이상)</td>
            <td>150,000원</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>진료확인서</td>
            <td>20,000원</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>
              향후진료비 추정서
              <br />
              (천만원 미만)
            </td>
            <td>100,000원</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>
              향후진료비 추정서
              <br />
              (천만원 이상)
            </td>
            <td>150,000원</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>진료기록사본(1-5매)</td>
            <td>1,000원</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>진료기록사본(6매이상)</td>
            <td>
              6매부터
              <br />
              1매당 100원
            </td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>제증명서 사본</td>
            <td>1,000원</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>진료기록영상</td>
            <td>10,000원</td>
            <td>&nbsp;</td>
          </tr>
        </table>
      </div>
    </div>
  );
}

export default TreatmentInfo_2;
