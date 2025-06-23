import React from 'react';
import LineImageBanner from '../../../../components/web/LineImageBanner';
import Title from '../../../../components/web/Title';
import Text from '../../../../components/web/Text';
import Container from '../../../../components/web/Container';

import line_banner from '../../../../assets/images/line_banner.png';

function NonCovered() {
  return (
    <>
      <LineImageBanner
        CN="w-full h-40 flex justify-center items-center overflow-hidden"
        image={line_banner}
      >
        <div className="flex flex-col justify-center items-center mt-16 mb-3 mx-5">
          <Title
            as="h1"
            size="lg"
            CN="text-center text-BD-CharcoalBlack text-shadow-lg/20"
          >
            비급여 항목 안내
          </Title>
          <Text size="md" CN="text-center">
            Non-covered items information
          </Text>
        </div>
      </LineImageBanner>
      <Container>
        <div className="py-10">
          <Title as="h2" size="sm" CN="py-2.5">
            제증명수수료
          </Title>
          <Text size="base">
            1. 증명서 발급 당일 기본 1통에 대한 기준임 / 부수적인 검진료는
            별도로 함
          </Text>
          <Text size="base">
            2. 기본 1통 이외에 추가발급을 요할 때는 추가 1통당 1,000원. 접수료,
            진찰료 등은 별도로 산정하지 못함
          </Text>
          <table className="w-full mt-4 border-collapse">
            <thead>
              <tr>
                <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                  구분
                </th>
                <th className="w-180 bg-blue-700 text-white p-2 border border-blue-800">
                  비급여항목
                </th>
                <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                  금액
                </th>
                <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                  비고
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  rowSpan={10}
                  className="border border-gray-300 p-2 text-center"
                >
                  제증명서
                  <br />
                  발급수수료
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  일반진단서
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  20,000원
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  &nbsp;
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-center">
                  상해진단서(3주미만)
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  100,000원
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  &nbsp;
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-center">
                  상해진단서(3주이상)
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  150,000원
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  &nbsp;
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-center">
                  진료확인서
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  20,000원
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  &nbsp;
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-center">
                  향후진료비 추정서
                  <br />
                  (천만원 미만)
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  100,000원
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  &nbsp;
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-center">
                  향후진료비 추정서
                  <br />
                  (천만원 이상)
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  150,000원
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  &nbsp;
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-center">
                  진료기록사본(1-5매)
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  1,000원
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  &nbsp;
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-center">
                  진료기록사본(6매이상)
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  6매부터
                  <br />
                  1매당 100원
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  &nbsp;
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-center">
                  제증명서 사본
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  1,000원
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  &nbsp;
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-center">
                  진료기록영상
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  10,000원
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  &nbsp;
                </td>
              </tr>
            </tbody>
          </table>
          <div className="py-10">
            <Title as="h3" size="sm" CN="mt-20 mb-6">
              비급여항목임플란트
            </Title>
            <table className="w-full  border-collapse">
              <thead>
                <tr>
                  <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                    구분
                  </th>
                  <th className="w-180  bg-blue-700 text-white p-2 border border-blue-800">
                    비급여항목
                  </th>
                  <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                    금액
                  </th>
                  <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                    비고
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td
                    rowSpan={8}
                    className="border border-gray-300 p-2 text-center"
                  >
                    임플란트 수술
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    임플란트_덴티움, 덴티스
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    1,000,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    임플란트_오스템
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    1,050,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    CT가이드
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    1,200,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    상악동거상술(Crestal)
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    300,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    ※ 뼈이식재 추가시 20만원 추가
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    상악동거상술(Lateral)
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    1,200,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    뼈이식(GBR)
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    500,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    뼈이식(Ti-mesh)
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    800,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    치조골확장술
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    1,000,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    &nbsp;
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="py-10">
            <Title as="h3" size="sm" CN="mt-20 mb-6">
              비급여항목치은이식성형
            </Title>

            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                    구분
                  </th>
                  <th className="w-180  bg-blue-700 text-white p-2 border border-blue-800">
                    비급여항목
                  </th>
                  <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                    금액
                  </th>
                  <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                    비고
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    rowSpan={6}
                    className="border border-gray-300 p-2 text-center"
                  >
                    치은이식
                    <br />
                    성형
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    유리치은 이식술(FGG)
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    500,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    ※ 장치값 별도
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    결합조직 이식술(CTG)
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    500,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    ※ 장치값 별도
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    치은성형 A(치아당)
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    300,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    ※ VAT별도
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    치은성형 B(치아당)
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    500,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    ※ 뼈삭제 동반 / VAT 별도
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    치은착색제거(악당)
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    500,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    치근파개술(치아당)
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    400,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    &nbsp;
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="py-10">
            <Title as="h3" size="sm" CN="mt-20 mb-6">
              비급여항목레진
            </Title>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                    구분
                  </th>
                  <th className="w-180  bg-blue-700 text-white p-2 border border-blue-800">
                    비급여항목
                  </th>
                  <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                    금액
                  </th>
                  <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                    비고
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    rowSpan={6}
                    className="border border-gray-300 p-2 text-center"
                  >
                    레진
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    구치부 1면
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    80,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    구치부 2면 이상
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    120,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    전치부
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    120,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    치경부
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    60,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    Diastema
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    300,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    MTA
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    100,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    &nbsp;
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="py-10">
            <Title as="h3" size="sm" CN="mt-20 mb-6">
              비급여항목보존 및 보철치료
            </Title>

            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                    구분
                  </th>
                  <th className="w-180  bg-blue-700 text-white p-2 border border-blue-800">
                    비급여항목
                  </th>
                  <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                    금액
                  </th>
                  <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                    비고
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    rowSpan={9}
                    className="border border-gray-300 p-2 text-center"
                  >
                    보존
                    <br />
                    보철
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    PFM
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    450,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    ※ pmma 포함
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    지르코니아
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    550,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    ※ pmma 포함
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    테스트치아
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    50,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    ※ pmma (레진)
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    전치부 올세라믹
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    600,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    ※ VAT 별도 (레진)
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    라미네이트 PT
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    700,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    ※ VAT 별도
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    라미네이트 LS
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    500,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    ※ VAT 별도
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    E-MAX 오버레이
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    550,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    레진 코어
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    50,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    Wall Core
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    200,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    &nbsp;
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="py-10">
            <Title as="h3" size="sm" CN="mt-20 mb-6">
              비급여항목인레이,온레이
            </Title>

            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                    구분
                  </th>
                  <th className="w-180  bg-blue-700 text-white p-2 border border-blue-800">
                    비급여항목
                  </th>
                  <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                    금액
                  </th>
                  <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                    비고
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    rowSpan={9}
                    className="border border-gray-300 p-2 text-center"
                  >
                    인레이
                    <br />
                    온레이
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    Direct 레진
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    250,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    E-MAX 인레이
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    400,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    &nbsp;
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">
                    E-MAX 온레이
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    500,000원
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    &nbsp;
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="py-10">
              <Title as="h3" size="sm" CN="mt-20 mb-6">
                비급여항목교정치료
              </Title>

              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                      구분
                    </th>
                    <th className="w-180  bg-blue-700 text-white p-2 border border-blue-800">
                      비급여항목
                    </th>
                    <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                      금액
                    </th>
                    <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                      비고
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      rowSpan={9}
                      className="border border-gray-300 p-2 text-center"
                    >
                      성인
                      <br />
                      교정
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      클리피메탈
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      4,500,000원
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 text-center">
                      데이몬 메탈
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      5,000,000원
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 text-center">
                      데이몬 클리어
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      5,500,000원
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 text-center">
                      투명교정
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      5,500,000원
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 text-center">
                      부분교정_브라켓
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      1,500,000원
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 text-center">
                      부분교정_투명
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      2,500,000원
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 text-center">
                      고정식/가철식 유지장치
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      200,000원
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 text-center">
                      PLA/RPE/TPA
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      300,000원
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 text-center">
                      mini implant
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      150,000원
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td
                      rowSpan={9}
                      className="border border-gray-300 p-2 text-center"
                    >
                      어린이
                      <br />
                      교정
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      어린이 부분교정
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      2,000,000원
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 text-center">
                      CL2_Twin block
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      800,000원
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 text-center">
                      CL2_Bionator
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      700,000원
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 text-center">
                      CL3_1차교정
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      2,500,000원
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      &nbsp;
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="py-10">
                <Title as="h3" size="sm" CN="mt-20 mb-6">
                  비급여항목틀니
                </Title>

                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                        구분
                      </th>
                      <th className="w-180  bg-blue-700 text-white p-2 border border-blue-800">
                        비급여항목
                      </th>
                      <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                        금액
                      </th>
                      <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                        비고
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        rowSpan={11}
                        className="border border-gray-300 p-2 text-center"
                      >
                        틀니
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        틀니
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        2,000,000원
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 text-center">
                        Flexible Denture
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        1,200,000원
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 text-center">
                        임시틀니
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        400,000원
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 text-center">
                        플리퍼
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        80,000원
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 text-center">
                        임플란트 틀니 PT
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        2,500,000원
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 text-center">
                        임플란트 틀니_로게이터 교환 (mail attachment)
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        50,000원
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        ※ 개당금액
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 text-center">
                        임플란트 틀니_로게이터 교환(Housing)
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        200,000원
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 text-center">
                        틀니 원내 수리
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        200,000원
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 text-center">
                        틀니 기공소 수리
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        300,000원
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 text-center">
                        타치과 틀니 원내수리
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        300,000원
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 text-center">
                        타치과 틀니 기공소 수리
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        400,000원
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &nbsp;
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="py-10">
                <Title as="h3" size="sm" CN="mt-20 mb-6">
                  비급여항목기타진료
                </Title>

                <table className="mb-10 w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                        구분
                      </th>
                      <th className="w-180  bg-blue-700 text-white p-2 border border-blue-800">
                        비급여항목
                      </th>
                      <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                        금액
                      </th>
                      <th className="w-60 bg-blue-700 text-white p-2 border border-blue-800">
                        비고
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        rowSpan={11}
                        className="border border-gray-300 p-2 text-center"
                      >
                        틀니
                        <br />
                        진료
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        불소바니쉬
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        30,000원
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 text-center">
                        구강위생교육(TBI)
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        30,000원
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 text-center">
                        스케일링 비보험
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        50,000원
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 text-center">
                        치아미백SET
                        <br />
                        (전문가미백 + 자가미백)
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        530,000원
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 text-center">
                        전문가미백(3회)
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        300,000원
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        ※ VAT 별도
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 text-center">
                        자가미백(장치+약제)
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        300,000원
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        ※ 개당금액
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 text-center">
                        보톡스_부위당
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        200,000원
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 text-center">
                        스플린트
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        700,000원
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 text-center">
                        옴니백
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        150,000원
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 text-center">
                        지혈제
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        20,000원
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 text-center">
                        무통주사
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        30,000원
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        &nbsp;
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center gap-2 mb-[165px] mx-5"></div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export default NonCovered;
