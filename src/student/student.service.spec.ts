import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { StudentRepository } from './student.repository';
import { StudentMocks } from './mock/student.mocks';
import { NotFoundException } from '@nestjs/common';

const mockRepository = () => ({
  getProfile: jest.fn(),
});

describe('StudentService', () => {
  let service: StudentService;
  let repository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        { provide: StudentRepository, useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    repository = module.get<StudentRepository>(StudentRepository);
  });

  it('should return student profile', async () => {
    repository.getProfile.mockResolvedValue(StudentMocks.profileDto);
    const expected = await service.getProfile(StudentMocks.payload);
    expect(expected.personal).not.toBeNull();
    expect(expected.parent).not.toBeNull();
  });

  it('should throw an error if profile is not found', () => {
    repository.getProfile.mockResolvedValue(null);
    expect(service.getProfile(StudentMocks.payload)).rejects.toThrow(
      NotFoundException,
    );
  });
});