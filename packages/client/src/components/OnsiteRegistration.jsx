import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const OnsiteRegistration = () => {
  const [form, setForm] = useState({
    userId: '',
    department: '',
    doctor: '',
    visitType: '초진',
    symptoms: '',
    isInsured: false,
    insuranceType: '',
    receptionStaffId: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/visits', form);
      alert('접수가 완료되었습니다.');
      setForm({ ...form, userId: '', symptoms: '' });
    } catch (err) {
      alert('접수 오류 발생');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>환자 이메일 (userId)</Form.Label>
            <Form.Control type="email" name="userId" value={form.userId} onChange={handleChange} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>진료과</Form.Label>
            <Form.Select name="department" value={form.department} onChange={handleChange} required>
              <option value="">선택</option>
              <option>치과</option>
              <option>내과</option>
              <option>피부과</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>담당의</Form.Label>
            <Form.Control type="text" name="doctor" value={form.doctor} onChange={handleChange} />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>초진/재진</Form.Label>
            <Form.Select name="visitType" value={form.visitType} onChange={handleChange}>
              <option>초진</option>
              <option>재진</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>증상</Form.Label>
        <Form.Control as="textarea" rows={2} name="symptoms" value={form.symptoms} onChange={handleChange} />
      </Form.Group>

      <Row className="mb-3">
        <Col>
          <Form.Check type="checkbox" label="보험 적용" name="isInsured" checked={form.isInsured} onChange={handleChange} />
        </Col>
        <Col>
          <Form.Control type="text" placeholder="보험 종류 (예: 국민건강보험)" name="insuranceType" value={form.insuranceType} onChange={handleChange} />
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>접수 직원 ID</Form.Label>
        <Form.Control type="text" name="receptionStaffId" value={form.receptionStaffId} onChange={handleChange} />
      </Form.Group>

      <Button type="submit" variant="primary">접수 완료</Button>
    </Form>
  );
};

export default OnsiteRegistration;
