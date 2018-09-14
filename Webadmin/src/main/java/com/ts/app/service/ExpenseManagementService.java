package com.ts.app.service;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Expense;
import com.ts.app.domain.ExpenseCategory;
import com.ts.app.domain.Site;
import com.ts.app.repository.*;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.ExpenseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.transaction.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@Transactional
public class ExpenseManagementService extends AbstractService {

    private final Logger log = LoggerFactory.getLogger(FeedbackService.class);

    @Inject
    private ExpenseRepository expenseRepository;

    @Inject
    private ExpenseCategoryRepository expenseCategoryRepository;

    @Inject
    private ProjectRepository projectRepository;

    @Inject
    private SiteRepository siteRepository;

    @Inject
    private UserRepository userRepository;

    @Inject
    private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;


    public ExpenseDTO saveExpense(ExpenseDTO expenseDTO) {

        Expense expense = new Expense();

        Expense previousExpenseDetails = new Expense();

        ExpenseDTO expenseDTO1;

        if(expenseDTO.getSiteId()>0){
            Site site = siteRepository.findOne(expenseDTO.getSiteId());
            expense.setSite(site);

            previousExpenseDetails = findLatestRecordBySite(expenseDTO.getSiteId());
        }



        expense.setMode(expenseDTO.getMode());
        expense.setCurrency(expenseDTO.getCurrency());
        expense.setPaymentType(expenseDTO.getPaymentType());
        expense.setBillable(expenseDTO.isBillable());
        expense.setReimbursable(expenseDTO.isReimbursable());
        expense.setDescription(expenseDTO.getDescription());
//        expense.setBalanceAmount(expenseDTO.getBalanceAmount());
        if(expenseDTO.getExpenseDate() !=null){
            expense.setExpenseDate(expenseDTO.getExpenseDate());
        }

        if(Objects.equals(expenseDTO.getMode(), "debit")){
            expense.setExpenseCategory(expenseDTO.getExpenseCategory());
            expense.setBalanceAmount(previousExpenseDetails.getBalanceAmount()-expenseDTO.getDebitAmount());
            expense.setDebitAmount(expenseDTO.getDebitAmount());
        }



        if (Objects.equals(expenseDTO.getMode(), "credit")){
            if(previousExpenseDetails.getBalanceAmount()>0){
                expense.setBalanceAmount(previousExpenseDetails.getBalanceAmount()+expenseDTO.getCreditAmount());
                expense.setCreditAmount(expenseDTO.getCreditAmount());

            }else{
                expense.setCreditAmount(expenseDTO.getCreditAmount());
            }

        }


        Expense saveResult = expenseRepository.save(expense);

         expenseDTO1 = mapperUtil.toModel(saveResult, ExpenseDTO.class);

         log.info("Expense saved - --------------"+expenseDTO1.getMode());

        return expenseDTO1 ;
    }

    public List<ExpenseDTO> findAll(int currPage) {
        Pageable pageRequest = createPageRequest(currPage);
        Page<Expense> result = expenseRepository.findAll(pageRequest);
        return mapperUtil.toModelList(result.getContent(), ExpenseDTO.class);
    }

    public List<ExpenseCategory> findAllExpenseCategories(){
        return expenseCategoryRepository.findAll();
    }

    public Expense findLatestRecordBySite(long siteId){
        List<Expense> expenseList = expenseRepository.findLatestEntryBySite(siteId);

        if(expenseList.isEmpty()){
            return null;
        }else{
            return expenseList.get(0);
        }

    }
}
