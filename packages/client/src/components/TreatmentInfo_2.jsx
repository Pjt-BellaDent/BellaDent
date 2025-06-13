import React from 'react';
import dentistry from '../assets/dentistry.png';

function TreatmentInfo_2() {
  return (
    <>
      <div className="relative">
        <img
          src={dentistry}
          alt="dentistry"
          className="w-full h-50 object-cover"
        />

        <p className="absolute left-[50%] top-[50%] -translate-[50%] text-white text-shadow-lg/20 text-[32px]">
          <h2>
            <b>비급여 항목 안내</b>
          </h2>
        </p>
        <div className="mt-16 mb-3 mx-5"></div>
      </div>

      <div className="max-w-300 mx-auto">
        <title>non-covered items</title>

        <div>
          <h3 className="text-[24px] py-2.5">
            <b>제증명수수료</b>
          </h3>
          <p>
            1. 증명서 발급 당일 기본 1통에 대한 기준임 / 부수적인 검진료는
            별도로 함
          </p>
          <p>
            2. 기본 1통 이외에 추가발급을 요할 때는 추가 1통당 1,000원. 접수료,
            진찰료 등은 별도로 산정하지 못함
          </p>
          <table className="max-w-300 mx-auto mt-4 ">
            <tr>
              <th className="w-60 bg-blue-700 text-stone-50">구분</th>
              <th className="w-180 bg-blue-700 text-stone-50">비급여항목</th>
              <th className="w-60 bg-blue-700 text-stone-50">금액</th>
              <th className="w-60 bg-blue-700 text-stone-50">비고</th>
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
          <div>
            <h4 className="text-[24px] mt-20 mb-6">
              <b>비급여항목임플란트</b>
            </h4>
            <table className="my-16,my-3">
              <tr>
                <th className="w-60 bg-blue-700 text-stone-50">구분</th>
                <th className="w-180  bg-blue-700 text-stone-50">비급여항목</th>
                <th className="w-60 bg-blue-700 text-stone-50">금액</th>
                <th className="w-60 bg-blue-700 text-stone-50">비고</th>
              </tr>
              <tr>
                <td rowSpan={8}>임플란트 수술</td>
                <td>임플란트_덴티움, 덴티스</td>
                <td>1,000,000원</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>임플란트_오스템</td>
                <td>1,050,000원</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>CT가이드</td>
                <td>1,200,000원</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>상악동거상술(Crestal)</td>
                <td>300,000원</td>
                <td>※ 뼈이식재 추가시 20만원 추가</td>
              </tr>
              <tr>
                <td>상악동거상술(Lateral)</td>
                <td>1,200,000원</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>뼈이식(GBR)</td>
                <td>500,000원</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>뼈이식(Ti-mesh)</td>
                <td>800,000원</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>치조골확장술</td>
                <td>1,000,000원</td>
                <td>&nbsp;</td>
              </tr>
            </table>
          </div>

          <div>
            <h5 className="text-[24px] mt-20 mb-6">
              <b>비급여항목치은이식성형</b>
            </h5>

            <table>
              <tr>
                <th className="w-60 bg-blue-700 text-stone-50">구분</th>
                <th className="w-180  bg-blue-700 text-stone-50">비급여항목</th>
                <th className="w-60 bg-blue-700 text-stone-50">금액</th>
                <th className="w-60 bg-blue-700 text-stone-50">비고</th>
              </tr>
              <tr>
                <td rowSpan={6}>
                  치은이식
                  <br />
                  성형
                </td>
                <td>유리치은 이식술(FGG)</td>
                <td>500,000원</td>
                <td>※ 장치값 별도</td>
              </tr>
              <tr>
                <td>결합조직 이식술(CTG)</td>
                <td>500,000원</td>
                <td>※ 장치값 별도</td>
              </tr>
              <tr>
                <td>치은성형 A(치아당)</td>
                <td>300,000원</td>
                <td>※ VAT별도</td>
              </tr>
              <tr>
                <td>치은성형 B(치아당)</td>
                <td>500,000원</td>
                <td>※ 뼈삭제 동반 / VAT 별도</td>
              </tr>
              <tr>
                <td>치은착색제거(악당)</td>
                <td>500,000원</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>치근파개술(치아당)</td>
                <td>400,000원</td>
                <td>&nbsp;</td>
              </tr>
            </table>
          </div>
          <div>
            <h6 className="text-[24px] mt-20 mb-6">
              <b>비급여항목레진</b>
            </h6>
            <table>
              <tr>
                <th className="w-60 bg-blue-700 text-stone-50">구분</th>
                <th className="w-180  bg-blue-700 text-stone-50">비급여항목</th>
                <th className="w-60 bg-blue-700 text-stone-50">금액</th>
                <th className="w-60 bg-blue-700 text-stone-50">비고</th>
              </tr>
              <tr>
                <td rowSpan={6}>레진</td>
                <td>구치부 1면</td>
                <td>80,000원</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>구치부 2면 이상</td>
                <td>120,000원</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>전치부</td>
                <td>120,000원</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>치경부</td>
                <td>60,000원</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>Diastema</td>
                <td>300,000원</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>MTA</td>
                <td>100,000원</td>
                <td>&nbsp;</td>
              </tr>
            </table>
          </div>
          <div>
            <h6 className="text-[24px] mt-20 mb-6">
              <b>비급여항목보존 및 보철치료</b>
            </h6>

            <table>
              <tr>
                <th className="w-60 bg-blue-700 text-stone-50">구분</th>
                <th className="w-180  bg-blue-700 text-stone-50">비급여항목</th>
                <th className="w-60 bg-blue-700 text-stone-50">금액</th>
                <th className="w-60 bg-blue-700 text-stone-50">비고</th>
              </tr>
              <tr>
                <td rowSpan={9}>
                  보존
                  <br />
                  보철
                </td>
                <td>PFM</td>
                <td>450,000원</td>
                <td>※ pmma 포함</td>
              </tr>
              <tr>
                <td>지르코니아</td>
                <td>550,000원</td>
                <td>※ pmma 포함</td>
              </tr>
              <tr>
                <td>테스트치아</td>
                <td>50,000원</td>
                <td>※ pmma (레진)</td>
              </tr>
              <tr>
                <td>전치부 올세라믹</td>
                <td>600,000원</td>
                <td>※ VAT 별도 (레진)</td>
              </tr>
              <tr>
                <td>라미네이트 PT</td>
                <td>700,000원</td>
                <td>※ VAT 별도</td>
              </tr>
              <tr>
                <td>라미네이트 LS</td>
                <td>500,000원</td>
                <td>※ VAT 별도</td>
              </tr>
              <tr>
                <td>E-MAX 오버레이</td>
                <td>550,000원</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>레진 코어</td>
                <td>50,000원</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>Wall Core</td>
                <td>200,000원</td>
                <td>&nbsp;</td>
              </tr>
            </table>
          </div>
          <div>
            <h6 className="text-[24px] mt-20 mb-6">
              <b>비급여항목인레이,온레이</b>
            </h6>

            <table>
              <tr>
                <th className="w-60 bg-blue-700 text-stone-50">구분</th>
                <th className="w-180  bg-blue-700 text-stone-50">비급여항목</th>
                <th className="w-60 bg-blue-700 text-stone-50">금액</th>
                <th className="w-60 bg-blue-700 text-stone-50">비고</th>
              </tr>
              <tr>
                <td rowSpan={9}>
                  인레이
                  <br />
                  온레이
                </td>
                <td>Direct 레진</td>
                <td>250,000원</td>
                <td>&nbsp;</td>
              </tr>

              <tr>
                <td>E-MAX 인레이</td>
                <td>400,000원</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>E-MAX 온레이</td>
                <td>500,000원</td>
                <td>&nbsp;</td>
              </tr>
            </table>

            <div>
              <h6 className=" text-[24px] mt-20 mb-6">
                <b>비급여항목교정치료</b>
              </h6>

              <table>
                <tr>
                  <th className="w-60 bg-blue-700 text-stone-50">구분</th>
                  <th className="w-180  bg-blue-700 text-stone-50">
                    비급여항목
                  </th>
                  <th className="w-60 bg-blue-700 text-stone-50">금액</th>
                  <th className="w-60 bg-blue-700 text-stone-50">비고</th>
                </tr>
                <tr>
                  <td rowSpan={9}>
                    성인
                    <br />
                    교정
                  </td>
                  <td>클리피메탈</td>
                  <td>4,500,000원</td>
                  <td>&nbsp;</td>
                </tr>

                <tr>
                  <td>데이몬 메탈</td>
                  <td>5,000,000원</td>
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  <td>데이몬 클리어</td>
                  <td>5,500,000원</td>
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  <td>투명교정</td>
                  <td>5,500,000원</td>
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  <td>부분교정_브라켓</td>
                  <td>1,500,000원</td>
                  <td>&nbsp;</td>
                </tr>

                <tr>
                  <td>부분교정_투명</td>
                  <td>2,500,000원</td>
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  <td>고정식/가철식 유지장치</td>
                  <td>200,000원</td>
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  <td>PLA/RPE/TPA</td>
                  <td>300,000원</td>
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  <td>mini implant</td>
                  <td>150,000원</td>
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  <td rowSpan={9}>
                    어린이
                    <br />
                    교정
                  </td>
                  <td>어린이 부분교정</td>
                  <td>2,000,000원</td>
                  <td>&nbsp;</td>
                </tr>

                <tr>
                  <td>CL2_Twin block</td>
                  <td>800,000원</td>
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  <td>CL2_Bionator</td>
                  <td>700,000원</td>
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  <td>CL3_1차교정</td>
                  <td>2,500,000원</td>
                  <td>&nbsp;</td>
                </tr>
              </table>

              <div>
                <h6 className="text-[24px] mt-20 mb-6 ">
                  <b>비급여항목틀니</b>
                </h6>

                <table>
                  <tr>
                    <th className="w-60 bg-blue-700 text-stone-50">구분</th>
                    <th className="w-180  bg-blue-700 text-stone-50">
                      비급여항목
                    </th>
                    <th className="w-60 bg-blue-700 text-stone-50">금액</th>
                    <th className="w-60 bg-blue-700 text-stone-50">비고</th>
                  </tr>
                  <tr>
                    <td rowSpan={11}>틀니</td>
                    <td>틀니</td>
                    <td>2,000,000원</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>Flexible Denture</td>
                    <td>1,200,000원</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>임시틀니</td>
                    <td>400,000원</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>플리퍼</td>
                    <td>80,000원</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>임플란트 틀니 PT</td>
                    <td>2,500,000원</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>임플란트 틀니_로게이터 교환 (mail attachment)</td>
                    <td>50,000원</td>
                    <td>※ 개당금액</td>
                  </tr>
                  <tr>
                    <td>임플란트 틀니_로게이터 교환(Housing)</td>
                    <td>200,000원</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>틀니 원내 수리</td>
                    <td>200,000원</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>틀니 기공소 수리</td>
                    <td>300,000원</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>타치과 틀니 원내수리</td>
                    <td>300,000원</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>타치과 틀니 기공소 수리</td>
                    <td>400,000원</td>
                    <td>&nbsp;</td>
                  </tr>
                </table>
              </div>
              <div>
                <h6 className="text-[24px] mt-20 mb-6">
                  <b>비급여항목기타진료</b>
                </h6>

                <table className="mb-10">
                  <tr>
                    <th className="w-60 bg-blue-700 text-stone-50">구분</th>
                    <th className="w-180  bg-blue-700 text-stone-50">
                      비급여항목
                    </th>
                    <th className="w-60 bg-blue-700 text-stone-50">금액</th>
                    <th className="w-60 bg-blue-700 text-stone-50">비고</th>
                  </tr>
                  <tr>
                    <td rowSpan={11}>
                      틀니
                      <br />
                      진료
                    </td>
                    <td>불소바니쉬</td>
                    <td>30,000원</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>구강위생교육(TBI)</td>
                    <td>30,000원</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>스케일링 비보험</td>
                    <td>50,000원</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>
                      치아미백SET
                      <br />
                      (전문가미백 + 자가미백)
                    </td>
                    <td>530,000원</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>전문가미백(3회)</td>
                    <td>300,000원</td>
                    <td>※ VAT 별도</td>
                  </tr>
                  <tr>
                    <td>자가미백(장치+약제)</td>
                    <td>300,000원</td>
                    <td>※ 개당금액</td>
                  </tr>
                  <tr>
                    <td>보톡스_부위당</td>
                    <td>200,000원</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>스플린트</td>
                    <td>700,000원</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>옴니백</td>
                    <td>150,000원</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>지혈제</td>
                    <td>20,000원</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>무통주사</td>
                    <td>30,000원</td>
                    <td>&nbsp;</td>
                  </tr>
                </table>
              </div>
              <div className="flex justify-center gap-2 mb-[165px] mx-5"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TreatmentInfo_2;