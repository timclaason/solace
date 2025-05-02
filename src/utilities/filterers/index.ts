import { Advocate } from '@/@types';

export const filterAdvocates = (
  advocates: Advocate[],
  searchTerm: string
): Advocate[] => {
  return advocates.filter((advocate) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return (
      advocate.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
      advocate.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
      advocate.city.toLowerCase().includes(lowerCaseSearchTerm) ||
      advocate.degree.toLowerCase().includes(lowerCaseSearchTerm) ||
      advocate.specialties.some((specialty: string) =>
        specialty.toLowerCase().includes(lowerCaseSearchTerm)
      ) ||
      advocate.yearsOfExperience.toString().includes(lowerCaseSearchTerm)
    );
  });
};
