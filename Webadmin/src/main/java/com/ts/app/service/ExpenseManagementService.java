package com.ts.app.service;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Expense;
import com.ts.app.domain.ExpenseCategory;
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

        Expense expense = mapperUtil.toEntity(expenseDTO, Expense.class);
        Expense saveResult = expenseRepository.save(expense);

        ExpenseDTO expenseDTO1 = mapperUtil.toModel(saveResult, ExpenseDTO.class);

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
}
