package com.ts.app.service.util;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.web.rest.dto.BaseDTO;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * Util class to convert Entity to Model and Model to Entity
 * @author gnana
 *
 * @param <E>
 * @param <M>
 */
@Component
public class MapperUtil<E extends AbstractAuditingEntity, M extends BaseDTO> {

	public <E extends AbstractAuditingEntity, M extends BaseDTO> E  toEntity(M model, Class<E> entityType) {
		E entity = null;
		if(model != null) {
			ModelMapper mapper = new ModelMapper();
			mapper.getConfiguration().setAmbiguityIgnored(true);
			entity = mapper.map(model, entityType);
		}	
		return entity;
	}
	
	public  void  toEntity(M model,E entity) {
		ModelMapper mapper = new ModelMapper();
		mapper.getConfiguration().setAmbiguityIgnored(true);
		mapper.map(model, entity);
	}
	public <E extends AbstractAuditingEntity, M extends BaseDTO> M  toModel(E entity, Class<M> modelType) {
		M model = null;
		if(entity != null) {
			ModelMapper mapper = new ModelMapper();
			//mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
			mapper.getConfiguration().setAmbiguityIgnored(true);
			model = mapper.map(entity, modelType);
		}	
		return model;
	}
	
	public <E extends AbstractAuditingEntity, M extends BaseDTO> List<M> toModelList(List<E> entities, Class<M> modelType) {
		List<M> modelList = new ArrayList<M>();
		if(!CollectionUtils.isEmpty(entities)) {
			for(E entity : entities) {
				modelList.add(toModel(entity, modelType));
			}
		}
		return modelList;
	}
}
