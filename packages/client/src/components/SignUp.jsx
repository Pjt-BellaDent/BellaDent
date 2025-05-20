import { useState } from 'react';
import axios from 'axios';

function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_check: '',
    phone: '',
    address: '',
    birth_date: '',
    gender: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  function handleChangeRadio(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.id,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.password_check) {
        alert('비밀번호가 일치하지 않습니다. 다시 확인하세요.');
        return;
      }
      const url = 'http://localhost:3000/users/signUp';
      const response = await axios.post(url, {
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        birthDate: formData.birth_date,
        gender: formData.gender,
      });
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex items-center">
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900 flex-1/4"
            >
              이메일
            </label>
            <div className="mt-2 flex-3/4">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="example@email.com"
                required
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-gray-900 flex-1/4"
            >
              비밀번호
            </label>
            <div className="mt-2 flex-3/4">
              <input
                type="password"
                name="password"
                id="password"
                minLength={6}
                required
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password_check"
              className="block text-sm/6 font-medium text-gray-900 flex-1/4"
            >
              비밀번호 확인
            </label>
            <div className="flex relative mt-2 flex-3/4">
              <input
                type="password"
                name="password_check"
                id="password_check"
                required
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              {formData.password_check &&
                formData.password !== formData.password_check && (
                  <span className="absolute text-xs text-red-600 right-3 top-1/2 -translate-y-1/2">
                    비밀번호를 확인하세요
                  </span>
                )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="phone"
              className="block text-sm/6 font-medium text-gray-900 flex-1/4"
            >
              연락처
            </label>
            <div className="mt-2 flex-3/4">
              <input
                type="text"
                name="phone"
                id="phone"
                maxLength={13}
                required
                placeholder="01X-XXXX-XXXX"
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="address"
              className="block text-sm/6 font-medium text-gray-900 flex-1/4"
            >
              주소
            </label>
            <div className="mt-2 flex-3/4">
              <input
                type="text"
                name="address"
                id="address"
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="birth_date"
              className="block text-sm/6 font-medium text-gray-900 flex-1/4"
            >
              생년월일
            </label>
            <div className="mt-2 flex-3/4">
              <input
                type="text"
                name="birth_date"
                id="birth_date"
                maxLength={8}
                minLength={8}
                required
                placeholder="YYYYMMDD"
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="flex items-center mt-6 space-y-6">
            <div className="flex items-center gap-x-3">
              <input
                id="남성"
                name="gender"
                type="radio"
                required
                onChange={handleChangeRadio}
                className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
              />
              <label
                htmlFor="남성"
                className="block text-sm/6 font-medium text-gray-900"
              >
                남성
              </label>
            </div>
            <div className="flex items-center gap-x-3">
              <input
                id="여성"
                name="gender"
                type="radio"
                required
                onChange={handleChangeRadio}
                className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
              />
              <label
                htmlFor="여성"
                className="block text-sm/6 font-medium text-gray-900"
              >
                여성
              </label>
            </div>
          </div>
          <div className="mt-6 space-y-6">
            <div className="flex gap-3">
              <div className="flex h-6 shrink-0 items-center">
                <div className="group grid size-4 grid-cols-1">
                  <input
                    id="comments"
                    name="comments"
                    type="checkbox"
                    required
                    aria-describedby="comments-description"
                    className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                  />
                  <svg
                    fill="none"
                    viewBox="0 0 14 14"
                    className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                  >
                    <path
                      d="M3 8L6 11L11 3.5"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-0 group-has-checked:opacity-100"
                    />
                    <path
                      d="M3 7H11"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-0 group-has-indeterminate:opacity-100"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-sm/6">
                <label htmlFor="comments" className="font-medium text-gray-900">
                  이용약관
                </label>
              </div>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              등록
            </button>
          </div>
        </form>
        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Not a member?
          <a
            href="#"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Start a 14 day free trial
          </a>
        </p>
      </div>
    </>
  );
}

export default SignUp;
