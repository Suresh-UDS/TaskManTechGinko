
export const onBoardingReferenceModel =  {
      employeeName:'',
      employeeCode:'',
      percentage:0,

      siteDetails:{
            projectCode:'',
            wbsId:'',
            projectDescription:'',
            wbsDescription:'',
            position:'',
            grossSal:0.00

      },

      personalDetails: {
            employeeCode:  '',
            employeeName: '',
            relationshipDetails: [],
            gender: '',
            maritalStatus: '',
            dateOfBirth: '',
            dateOfJoining: '',
            religion: '',
            bloodGroup: '',
            identificationMark: [],
            identificationMark1:'',
            identificationMark2:''
      },
      contactDetails: {
            contactNumber: '',
            emergencyConatctNo: '',
            communicationAddress: {},
            permanentAddress: {},
            addressProof: 'assets/imgs/placeholder.png'
      },
      familyAcademicDetails: {
            educationQualification: {},
            nomineeDetail: {},
      },
      employmentDetails: {
            previousEmployee : {},
      },
      kycDetails: {
            aadharNumber: '',
            bankDetails: [],
            aadharPhotoCopy: 'assets/imgs/placeholder.png',
            employeeSignature: 'assets/imgs/placeholder.png',
            profilePicture: 'assets/imgs/placeholder.png',
            thumbImpressenRight:'assets/imgs/placeholder.png',
            thumbImpressenLeft:'assets/imgs/placeholder.png',
            prePrintedStatement: 'assets/imgs/placeholder.png',
      },

      declaration:{
            agreeTermsAndConditions:false
      }
};
