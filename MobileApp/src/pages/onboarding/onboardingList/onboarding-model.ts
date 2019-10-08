
export const onBoardingReferenceModel =  {
      employeeName:'',
      employeeCode:'',
      percentage:0,
      id:0,
      submitted:false,
      siteDetails:{
            projectCode:'',
            wbsId:'',
            projectDescription:'',
            wbsDescription:'',
            position:'',
            gross:0.00

      },

      personalDetails: {
            employeeCode:  '',
            employeeName: '',
            relationshipDetails: [],
            spouseName: '',
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
            agreeTermsAndConditions:false,
            onboardedPlace: ''
      }
};
