
export const onBoardingModel =  {

      siteDetails:{
            projectCode:'',
            wbsId:'',
            projectDescription:'',
            wbsDescription:'',
            position:''

      },

      personalDetails: {
            employeeCode:  '',
            employeeName: '',
            relationshipDetails: [{name:'',relationship:'',contactNumber:''},{name:'',relationship:'',contactNumber:''}],
            spouseName: '',
            gender: '',
            maritalStatus: '',
            dateOfBirth: '',
            dateOfJoining: '',
            religion: '',
            bloodGroup: '',
            identificationMark: '',
      },
      contactDetails: {
            contactNumber: '',
            emergencyConatctNo: '',
            communicationAddress: [{address:'',city:'',state:''}],
            permanentAddress: [{address:'',city:'',state:''}],
            addressProof: ''
      },
      familyAcademicDetails: {
            educationQualification: [{qualification:'',institute:''}],
            nomineeDetail: [{name:'', relationship:'',contactNumber:'',nominePercentage:0}],
      },
      employmentDetails: {
            previousEmployee : [{isEmploymentEarlier:'',name:'',designation:''}],
      },
      kycDetails: {
            aadharNumber: '',
            bankDetails: [{accountNo:'',ifsc:''}],
            aadharPhotoCopy: '',
            employeeSignature: '',
            profilePicture: '',
            thumbImpressenRight:'',
            thumbImpressenLeft:'',
            prePrintedStatement: '',
      },

      declaration:{
            agreeTermsAndConditions:false,
            onboardedPlace:''
      }
};
